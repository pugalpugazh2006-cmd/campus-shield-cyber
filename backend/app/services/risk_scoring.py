from typing import Dict, Any
from datetime import datetime

# Rule-based weights (configurable)
WEIGHTS = {
    "failed_attempts": 0.3,
    "new_device": 0.2,
    "location_distance": 0.3,
    "off_hours": 0.2
}

def calculate_rule_based_risk_score(
    failed_attempts_count: int,
    is_new_device: bool,
    location_distance_km: float,
    login_time: datetime
) -> Dict[str, Any]:
    """
    Calculates a rule-based risk score for a login attempt.
    
    Args:
        failed_attempts_count: Number of failed logins in a recent time window (e.g., last 10 mins).
        is_new_device: True if the device has not been seen for this user before.
        location_distance_km: Distance from the user's usual login city in kilometers.
        login_time: The timestamp of the login attempt.
        
    Returns:
        A dictionary containing the final 'score' (0.0 to 1.0) and the 'breakdown' of how it was calculated.
    """
    # 1. Normalize failed attempts (cap at 5 attempts = 1.0)
    failed_attempts_normalized = min(failed_attempts_count / 5.0, 1.0)
    
    # 2. New device flag
    new_device_score = 1.0 if is_new_device else 0.0
    
    # 3. Normalize location distance (cap at 1000 km = 1.0)
    location_distance_normalized = min(location_distance_km / 1000.0, 1.0)
    
    # 4. Off-hours flag (assuming off-hours is 10 PM to 6 AM local time)
    # Note: In a real system, you'd adjust this for the user's local timezone
    hour = login_time.hour
    is_off_hours = hour >= 22 or hour < 6
    off_hours_score = 1.0 if is_off_hours else 0.0
    
    # Calculate weighted final score
    final_score = (
        (WEIGHTS["failed_attempts"] * failed_attempts_normalized) +
        (WEIGHTS["new_device"] * new_device_score) +
        (WEIGHTS["location_distance"] * location_distance_normalized) +
        (WEIGHTS["off_hours"] * off_hours_score)
    )
    
    # Ensure score is within 0-1 bounds just in case
    final_score = max(0.0, min(final_score, 1.0))
    
    breakdown = {
        "failed_attempts": {
            "value": failed_attempts_count,
            "normalized": failed_attempts_normalized,
            "weight": WEIGHTS["failed_attempts"],
            "contribution": WEIGHTS["failed_attempts"] * failed_attempts_normalized
        },
        "new_device": {
            "value": is_new_device,
            "weight": WEIGHTS["new_device"],
            "contribution": WEIGHTS["new_device"] * new_device_score
        },
        "location_distance": {
            "value": location_distance_km,
            "normalized": location_distance_normalized,
            "weight": WEIGHTS["location_distance"],
            "contribution": WEIGHTS["location_distance"] * location_distance_normalized
        },
        "off_hours": {
            "value": is_off_hours,
            "weight": WEIGHTS["off_hours"],
            "contribution": WEIGHTS["off_hours"] * off_hours_score
        }
    }
    
    return {
        "score": final_score,
        "breakdown": breakdown
    }
