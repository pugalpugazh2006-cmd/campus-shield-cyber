from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.db.models import User
from app.services.threat_detection import process_security_event
import time
import random

router = APIRouter()

@router.post("/analyze-url")
def analyze_url(url: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Mock endpoint for phishing URL analysis.
    """
    is_phishing = False
    reasons = []
    
    if "admin" in url and "secure" not in url:
        is_phishing = True
        reasons.append("Suspicious keyword 'admin' without secure context")
    if "update-password" in url:
        is_phishing = True
        reasons.append("Common phishing path 'update-password'")
    if "http://" in url:
        is_phishing = True
        reasons.append("Insecure HTTP protocol")
        
    # Introduce small delay for realism
    time.sleep(0.5)
    
    return {
        "url": url,
        "is_phishing": is_phishing,
        "risk_score": 85 if is_phishing else 10,
        "reasons": reasons
    }

@router.post("/demo/{scenario}")
def trigger_demo_scenario(
    scenario: str, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Triggers specific demo scenarios for the presentation.
    1. normal_login
    2. brute_force
    3. unusual_location (UBA)
    4. correlated_attack (ML + Rules)
    """
    user_id = current_user.id
    ip_address = f"192.168.1.{random.randint(10, 200)}"
    device_fingerprint = f"demo_device_{random.randint(100, 999)}"
    
    if scenario == "normal_login":
        process_security_event(
            db, user_id, "trusted_macbook_pro", "10.0.0.5", current_user.usual_city,
            "login", "Student Portal", True, background_tasks=background_tasks
        )
        return {"status": "success", "message": "Normal login logged."}
        
    elif scenario == "brute_force":
        for _ in range(6):
            process_security_event(
                db, user_id, "unknown_script_bot", "45.33.22.11", "Moscow",
                "login", "Student Portal", False, "incorrect_password", background_tasks=background_tasks
            )
        return {"status": "success", "message": "Brute force attack simulated."}
        
    elif scenario == "unusual_location":
        # Simulate a login from a new country/city immediately after a normal one
        process_security_event(
            db, user_id, "new_mobile_device", "185.34.22.1", "Beijing",
            "login", "Staff Portal", True, background_tasks=background_tasks
        )
        return {"status": "success", "message": "Impossible travel / unusual location simulated."}
        
    elif scenario == "correlated_attack":
        # Simulate a series of events that trigger ML and rules
        # 1. Phishing click (simulated via service access)
        process_security_event(
            db, user_id, device_fingerprint, ip_address, current_user.usual_city,
            "url_click", "Email Portal", True, background_tasks=background_tasks
        )
        # 2. Brute force attempts
        for _ in range(3):
            process_security_event(
                db, user_id, device_fingerprint, ip_address, current_user.usual_city,
                "login", "Admin Portal", False, "incorrect_password", background_tasks=background_tasks
            )
        # 3. Successful login to sensitive service at unusual hour
        process_security_event(
            db, user_id, device_fingerprint, ip_address, current_user.usual_city,
            "login", "Admin Portal", True, background_tasks=background_tasks
        )
        return {"status": "success", "message": "Correlated APT attack simulated."}
        
    raise HTTPException(status_code=400, detail="Unknown scenario")
