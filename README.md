# ScamShield 🛡️

Evidence-Based Scam and Phishing Threat Detection System.

Built for **Vedathon 2.0**.

## Architecture

- **`scamshield-backend/`**: FastAPI service with multi-vector static analyzers (URLs, SMS, emails), typosquatting / homoglyph heuristics, and SQLite audit logging.
- **`scamshield-frontend/`**: React + Vite single page application with dark glassmorphic UI, real-time threat scores, interactive demo cases, education center, and export capabilities.

## Getting Started

### Backend
```bash
cd scamshield-backend
pip install fastapi uvicorn pydantic
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Frontend
```bash
cd scamshield-frontend
npm install
npm run dev
```
