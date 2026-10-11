"""
ScamShield FastAPI Backend
"""
import json
import sqlite3
import uuid
from datetime import datetime
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Local analyzers
import sys
sys.path.insert(0, str(Path(__file__).parent))
from analyzer.url_analyzer import analyze_url, URLAnalysisResult, URLEvidence
from analyzer.message_analyzer import analyze_message, MessageAnalysisResult, MessageEvidence

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="ScamShield API",
    description="Evidence-based scam and phishing detection",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# SQLite history store
# ---------------------------------------------------------------------------
DB_PATH = Path(__file__).parent / "scamshield.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scan_history (
                id TEXT PRIMARY KEY,
                scan_type TEXT NOT NULL,
                input_preview TEXT NOT NULL,
                risk_level TEXT NOT NULL,
                risk_score INTEGER NOT NULL,
                summary TEXT NOT NULL,
                full_result TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        """)
        conn.commit()


init_db()


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------
class URLRequest(BaseModel):
    url: str


class MessageRequest(BaseModel):
    text: str


class EvidenceOut(BaseModel):
    signal: str
    severity: str
    explanation: str
    category: Optional[str] = None
    matched_text: Optional[str] = None


class ScanResult(BaseModel):
    id: str
    scan_type: str
    risk_level: str
    risk_score: int
    summary: str
    evidence: list[EvidenceOut]
    next_steps: list[str]
    limitations: list[str]
    created_at: str
    # URL-specific
    url: Optional[str] = None
    domain: Optional[str] = None
    is_https: Optional[bool] = None
    # Message-specific
    extracted_urls: Optional[list[str]] = None
    signal_counts: Optional[dict] = None


class HistoryItem(BaseModel):
    id: str
    scan_type: str
    input_preview: str
    risk_level: str
    risk_score: int
    summary: str
    created_at: str


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------
def url_evidence_to_out(e: URLEvidence) -> EvidenceOut:
    return EvidenceOut(signal=e.signal, severity=e.severity, explanation=e.explanation)


def msg_evidence_to_out(e: MessageEvidence) -> EvidenceOut:
    return EvidenceOut(
        signal=e.signal,
        severity=e.severity,
        explanation=e.explanation,
        category=e.category,
        matched_text=e.matched_text or None,
    )


def save_scan(scan_type: str, input_preview: str, result: ScanResult):
    with get_db() as conn:
        conn.execute(
            "INSERT INTO scan_history VALUES (?,?,?,?,?,?,?,?)",
            (
                result.id,
                scan_type,
                input_preview[:120],
                result.risk_level,
                result.risk_score,
                result.summary,
                result.model_dump_json(),
                result.created_at,
            ),
        )
        conn.commit()


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "service": "ScamShield API"}


@app.post("/analyze/url", response_model=ScanResult)
def analyze_url_endpoint(req: URLRequest):
    if not req.url.strip():
        raise HTTPException(400, "URL must not be empty")

    raw = analyze_url(req.url.strip())

    result = ScanResult(
        id=str(uuid.uuid4()),
        scan_type="url",
        risk_level=raw.risk_level,
        risk_score=raw.risk_score,
        summary=raw.summary,
        evidence=[url_evidence_to_out(e) for e in raw.evidence],
        next_steps=raw.next_steps,
        limitations=raw.limitations,
        created_at=datetime.utcnow().isoformat() + "Z",
        url=raw.url,
        domain=raw.domain,
        is_https=raw.is_https,
    )
    save_scan("url", req.url[:120], result)
    return result


@app.post("/analyze/message", response_model=ScanResult)
def analyze_message_endpoint(req: MessageRequest):
    if not req.text.strip():
        raise HTTPException(400, "Message text must not be empty")

    raw = analyze_message(req.text.strip())

    result = ScanResult(
        id=str(uuid.uuid4()),
        scan_type="message",
        risk_level=raw.risk_level,
        risk_score=raw.risk_score,
        summary=raw.summary,
        evidence=[msg_evidence_to_out(e) for e in raw.evidence],
        next_steps=raw.next_steps,
        limitations=raw.limitations,
        created_at=datetime.utcnow().isoformat() + "Z",
        extracted_urls=raw.extracted_urls,
        signal_counts=raw.signal_counts,
    )
    save_scan("message", req.text[:120], result)
    return result


@app.get("/history", response_model=list[HistoryItem])
def get_history(limit: int = 20):
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, scan_type, input_preview, risk_level, risk_score, summary, created_at "
            "FROM scan_history ORDER BY created_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
    return [dict(r) for r in rows]


@app.get("/history/{scan_id}", response_model=ScanResult)
def get_scan_detail(scan_id: str):
    with get_db() as conn:
        row = conn.execute(
            "SELECT full_result FROM scan_history WHERE id=?", (scan_id,)
        ).fetchone()
    if not row:
        raise HTTPException(404, "Scan not found")
    return json.loads(row["full_result"])


@app.delete("/history")
def clear_history():
    with get_db() as conn:
        conn.execute("DELETE FROM scan_history")
        conn.commit()
    return {"message": "History cleared"}


# ---------------------------------------------------------------------------
# Demo / test dataset endpoint
# ---------------------------------------------------------------------------
DEMO_CASES = [
    {
        "id": "demo-1",
        "type": "url",
        "label": "scam",
        "input": "http://paypal-login-secure.tk/verify?account=suspended&redirect=http://evil.com",
        "expected_risk": "critical",
        "description": "Classic PayPal phishing with HTTP, free TLD, impersonation, open-redirect",
    },
    {
        "id": "demo-2",
        "type": "url",
        "label": "scam",
        "input": "http://192.168.1.1/admin/login",
        "expected_risk": "high",
        "description": "Raw IP address URL with credential path",
    },
    {
        "id": "demo-3",
        "type": "url",
        "label": "legitimate",
        "input": "https://www.google.com/search?q=python+tutorial",
        "expected_risk": "safe",
        "description": "Standard Google HTTPS URL",
    },
    {
        "id": "demo-4",
        "type": "url",
        "label": "legitimate",
        "input": "https://github.com/openai/whisper",
        "expected_risk": "safe",
        "description": "GitHub repository URL",
    },
    {
        "id": "demo-5",
        "type": "message",
        "label": "scam",
        "input": "URGENT: Your SBI account has been suspended. Verify your Aadhaar and OTP immediately at http://sbi-verify.tk/login or your account will be closed within 24 hours!",
        "expected_risk": "critical",
        "description": "SMS phishing: bank impersonation, urgency, OTP harvest, suspicious URL",
    },
    {
        "id": "demo-6",
        "type": "message",
        "label": "scam",
        "input": "Congratulations! You have won a prize of Rs 50,00,000 in the KBC lottery. Claim your reward now. Call 9XXXXXXXXX and keep this confidential. Do not share this with anyone.",
        "expected_risk": "critical",
        "description": "Lottery scam: prize claim, secrecy instruction, financial lure",
    },
    {
        "id": "demo-7",
        "type": "message",
        "label": "legitimate",
        "input": "Hi John, your Amazon order #112-3456789-1234567 for 'Wireless Headphones' has been shipped. Expected delivery: Thursday 14 Oct. Track at amazon.com/orders.",
        "expected_risk": "low",
        "description": "Legitimate Amazon shipping notification",
    },
    {
        "id": "demo-8",
        "type": "message",
        "label": "legitimate",
        "input": "Your OTP for login to NetBanking is 847291. Valid for 10 minutes. Do not share this OTP with anyone. - HDFCBK",
        "expected_risk": "medium",
        "description": "Genuine OTP message (OTP keyword triggers medium — users should still be cautious)",
    },
    {
        "id": "demo-9",
        "type": "message",
        "label": "scam",
        "input": "Exciting remote job opportunity! Work from home part-time and earn 5000 daily just by reviewing videos on YouTube. Join our Telegram recruiter now @quick_hire_hr to start.",
        "expected_risk": "high",
        "description": "Task/Part-time job fraud: unreal wage, Telegram diversion, review tasks",
    },
    {
        "id": "demo-10",
        "type": "message",
        "label": "scam",
        "input": "Exclusive USDT airdrop bonus! Connect wallet now and double your deposit with guaranteed 200% profit within 24 hours. Enter seed phrase at http://claim-airdrop-usdt.xyz/connect",
        "expected_risk": "critical",
        "description": "Web3/Crypto drainer: seed phrase request, guaranteed profit, suspicious TLD",
    },
]


@app.get("/stats")
def get_stats():
    with get_db() as conn:
        total = conn.execute("SELECT COUNT(*) FROM scan_history").fetchone()[0]
        critical = conn.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level='critical'").fetchone()[0]
        high = conn.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level='high'").fetchone()[0]
        medium = conn.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level='medium'").fetchone()[0]
        low = conn.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level='low'").fetchone()[0]
        safe = conn.execute("SELECT COUNT(*) FROM scan_history WHERE risk_level='safe'").fetchone()[0]
        avg_score_row = conn.execute("SELECT AVG(risk_score) FROM scan_history").fetchone()[0]
        avg_score = round(avg_score_row or 0, 1)

    return {
        "total_scans": total,
        "critical_count": critical,
        "high_count": high,
        "medium_count": medium,
        "low_count": low,
        "safe_count": safe,
        "average_risk_score": avg_score,
    }


@app.get("/demo-cases")
def get_demo_cases():
    return DEMO_CASES


@app.post("/demo-cases/{case_id}/run")
def run_demo_case(case_id: str):
    case = next((c for c in DEMO_CASES if c["id"] == case_id), None)
    if not case:
        raise HTTPException(404, "Demo case not found")

    if case["type"] == "url":
        raw = analyze_url(case["input"])
        result = {
            "case": case,
            "risk_level": raw.risk_level,
            "risk_score": raw.risk_score,
            "matched_expected": raw.risk_level == case["expected_risk"],
            "evidence_count": len(raw.evidence),
        }
    else:
        raw = analyze_message(case["input"])
        result = {
            "case": case,
            "risk_level": raw.risk_level,
            "risk_score": raw.risk_score,
            "matched_expected": raw.risk_level == case["expected_risk"],
            "evidence_count": len(raw.evidence),
        }

    return result
