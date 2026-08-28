from typing import Dict, Any, List
from datetime import datetime

# Risk Score Configuration (0-100 scale)
WEIGHTS = {
    "failed_attempts": 25,     # Up to 25 pts
    "new_device": 15,          # 15 pts if new
    "location_distance": 20,   # Up to 20 pts
    "uba_deviation": 20,       # Up to 20 pts (scaled from UBA score)
    "ml_anomaly": 20           # Up to 20 pts (scaled from ML score)
}

def calculate_hybrid_risk_score(
    failed_attempts_count: int,
    is_new_device: bool,
    location_distance_km: float,
    uba_result: dict,
    ml_result: dict
) -> Dict[str, Any]:
    """
    Calculates a hybrid risk score (0-100) and provides explainable reasons.
    """
    reasons = []
    total_score = 0.0
    
    # 1. Failed attempts (max 25)
    failed_score = min(failed_attempts_count / 5.0, 1.0) * WEIGHTS["failed_attempts"]
    if failed_score > 0:
        total_score += failed_score
        reasons.append(f"{failed_attempts_count} failed login attempts in short window (+{int(failed_score)} risk).")

    # 2. New Device (15)
    if is_new_device:
        total_score += WEIGHTS["new_device"]
        reasons.append(f"Unrecognized new device detected (+{WEIGHTS['new_device']} risk).")

    # 3. Location anomaly (max 20)
    loc_score = min(location_distance_km / 1000.0, 1.0) * WEIGHTS["location_distance"]
    if loc_score > 0:
        total_score += loc_score
        reasons.append(f"Unusual login location detected (+{int(loc_score)} risk).")

    # 4. UBA Deviation (max 20)
    # uba_result['deviation_score'] is 0-100, we scale it to max 20
    uba_score = (uba_result.get("deviation_score", 0) / 100.0) * WEIGHTS["uba_deviation"]
    if uba_score > 0:
        total_score += uba_score
        for r in uba_result.get("reasons", []):
            if "matches normal baseline" not in r:
                reasons.append(f"UBA: {r} (+{int(uba_score)} risk).")

    # 5. ML Anomaly (max 20)
    # ml_result['score'] is 0.0 to 1.0
    ml_anomaly_score = ml_result.get("score", 0.0) * WEIGHTS["ml_anomaly"]
    if ml_anomaly_score > 0 and ml_result.get("is_anomaly"):
        total_score += ml_anomaly_score
        reasons.append(f"Isolation Forest ML flagged behavioral anomaly (+{int(ml_anomaly_score)} risk).")

    # Final score capped at 100
    final_score = min(max(total_score, 0.0), 100.0)
    
    # Determine risk level
    if final_score < 30:
        risk_level = "LOW"
    elif final_score < 60:
        risk_level = "MEDIUM"
    elif final_score < 80:
        risk_level = "HIGH"
    else:
        risk_level = "CRITICAL"
        
    if not reasons:
        reasons.append("Normal activity. No anomalies detected.")

    return {
        "score": final_score,
        "level": risk_level,
        "reasons": reasons,
        "breakdown": {
            "failed_attempts": failed_score,
            "new_device": WEIGHTS["new_device"] if is_new_device else 0,
            "location": loc_score,
            "uba": uba_score,
            "ml": ml_anomaly_score
        }
    }
