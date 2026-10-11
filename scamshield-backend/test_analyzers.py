from analyzer.url_analyzer import analyze_url
from analyzer.message_analyzer import analyze_message


def test_url_legitimate():
    res = analyze_url("https://www.google.com")
    assert res.risk_level == "safe"
    assert res.risk_score < 25


def test_url_phishing_typosquatting():
    res = analyze_url("http://paypa1.xyz/login")
    assert res.risk_level in ["high", "critical"]
    assert any("typosquatting" in e.signal.lower() or "suspicious tld" in e.signal.lower() for e in res.evidence)


def test_message_job_scam():
    text = "Work from home part-time and earn 5000 daily reviewing videos on YouTube. Contact Telegram recruiter @hr"
    res = analyze_message(text)
    assert res.risk_score >= 30
    assert any("job" in e.category.lower() or "telegram" in e.signal.lower() for e in res.evidence)


def test_message_crypto_drainer():
    text = "Exclusive crypto airdrop! Guaranteed 300% profit. Connect wallet and enter seed phrase immediately."
    res = analyze_message(text)
    assert res.risk_level in ["high", "critical"]
    assert any("crypto" in e.category.lower() or "seed phrase" in e.signal.lower() for e in res.evidence)


def test_message_legitimate_otp():
    text = "Your OTP for login to NetBanking is 847291. Valid for 10 minutes. - HDFCBK"
    res = analyze_message(text)
    assert res.risk_level in ["low", "medium"]
