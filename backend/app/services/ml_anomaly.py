import os
import joblib
import pandas as pd
from typing import Dict, Any

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_model", "isolation_forest.joblib")

# Load model globally (if it exists) so it doesn't reload on every request
_model = None
if os.path.exists(MODEL_PATH):
    _model = joblib.load(MODEL_PATH)

def calculate_ml_anomaly_score(
    login_hour: int,
    geo_distance_km: float,
    is_new_device: bool,
    failed_attempts: int
) -> float:
    """
    Predicts an anomaly score using the trained Isolation Forest model.
    Returns a score between 0.0 (normal) and 1.0 (highly anomalous).
    """
    if _model is None:
        # If the model hasn't been trained yet, return 0 or a default
        return 0.0
        
    import pandas as pd
    
    # Format data for prediction
    df = pd.DataFrame([{
        'login_hour': login_hour,
        'geo_distance_from_usual': geo_distance_km,
        'is_new_device': int(is_new_device),
        'failed_attempts_last_hour': failed_attempts
    }])
    
    # The Isolation Forest score_samples returns negative anomaly scores.
    # Lower values (more negative) indicate higher anomaly.
    raw_score = _model.score_samples(df)[0]
    
    # Normalize the score to a 0.0 to 1.0 scale (where 1.0 is highest risk)
    # The raw_score typically falls between -0.8 (highly anomalous) and 0.0 (very normal)
    # We will flip it and cap it for a clean 0-1 range.
    normalized_score = min(max(-raw_score, 0.0), 1.0)
    
    return float(normalized_score)

def calculate_hybrid_risk_score(
    rule_score: float,
    ml_score: float,
    rule_weight: float = 0.6,
    ml_weight: float = 0.4
) -> Dict[str, Any]:
    """
    Combines the rule-based score and the ML-based score into a single hybrid score.
    """
    hybrid_score = (rule_score * rule_weight) + (ml_score * ml_weight)
    
    return {
        "final_hybrid_score": min(max(hybrid_score, 0.0), 1.0),
        "rule_based_score": rule_score,
        "ml_anomaly_score": ml_score,
        "weights": {
            "rule_based": rule_weight,
            "ml_based": ml_weight
        }
    }
