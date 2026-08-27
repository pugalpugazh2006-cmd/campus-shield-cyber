# CampusShield 🛡️

CampusShield is a Smart Cyber Threat Detection System designed for college campus networks. Built for the IndiaSkills 2026 Cyber Security competition, it monitors login and network activity, detects suspicious behavior (brute-force attacks, unusual login locations, phishing URLs), calculates user risk scores, and provides a real-time incident response dashboard.

## 🌟 Key Features

1. **Hybrid Risk Scoring Engine**: 
   Combines a configurable Rule-Based scoring engine (weights applied to failed attempts, location distance, off-hours, new devices) with a Machine Learning Anomaly layer (Isolation Forest algorithm via `scikit-learn`) to produce a transparent, explainable, and highly accurate Risk Score.
2. **Brute-Force & Device Monitoring**:
   Automatically fingerprints devices (User-Agent + IP) and tracks rolling-window failed login attempts to instantly lock out or alert on brute-force attacks.
3. **Phishing URL Checker**:
   Utilizes Levenshtein distance algorithms to detect typosquatting (e.g., `gogle.com`), analyzes suspicious TLDs, and detects IP-literal malicious links.
4. **Interactive Security Dashboard**:
   A React-based UI providing a live feed of active security alerts, an incident management workflow (Open -> Investigating -> Resolved), and rich charts to visualize risk distributions.
5. **Comprehensive Audit Logging**:
   Every critical action (registrations, successful logins, failed attempts) is immutably logged for post-incident forensic analysis.

## 🏗️ Architecture

- **Backend**: Python 3, FastAPI, SQLAlchemy ORM
- **Database**: PostgreSQL
- **Machine Learning**: `scikit-learn`, `pandas`, `numpy` (Isolation Forest)
- **Frontend**: React, Vite, Tailwind CSS, Recharts

### Database Schema

- `Users`: Core identity and role management (student, faculty, admin).
- `Devices`: Track trusted vs. untrusted devices via fingerprinting.
- `LoginEvents`: Immutable ledger of every authentication attempt.
- `RiskScores`: Historical record of calculated risk scores, including a full JSON breakdown of *why* the score was given.
- `Alerts` & `Incidents`: Security ticketing system.
- `AuditLogs`: System-wide forensic trail.

## 🚀 Getting Started

### 1. Database Setup
Ensure PostgreSQL is installed and running. Create a database named `campusshield`. 
Update the credentials in `backend/app/core/config.py` or set environment variables:
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_SERVER`, `POSTGRES_DB`

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
# (Dependencies include fastapi, uvicorn, sqlalchemy, psycopg2-binary, scikit-learn, etc.)

# Generate synthetic data and train the ML model
python scripts/generate_ml_data.py

# Start the server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Running the Live Demo (Competition Scenario)

To demonstrate the system's capabilities in real-time to the judges:
1. Ensure both the FastAPI backend and React frontend are running.
2. Open a new terminal and run the attack simulation script:
   ```bash
   cd backend
   python scripts/demo_attack.py
   ```
3. Watch the terminal output as the script mimics a Kali Linux Hydra attack, rapidly attempting to guess a student's password.
4. Switch to the React Dashboard. You will see the system immediately flag the unrecognized device, calculate a high Hybrid Risk Score, and push a Critical Alert to the Incident Manager workflow!

## 🧮 Explaining the Risk Score Formula

The hybrid risk score is a weighted combination:
`Final Risk = (0.6 * Rule-Based Score) + (0.4 * ML Anomaly Score)`

**Rule-Based Score Formula:**
```python
score = (0.3 * normalized_failed_attempts) + 
        (0.2 * new_device_flag) + 
        (0.3 * normalized_geo_distance) + 
        (0.2 * off_hours_flag)
```
The exact breakdown is saved in `RiskScore.score_breakdown_json`, ensuring the system is never a "black box" and security analysts can understand exactly why an alert was fired.
