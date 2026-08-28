import os
import joblib
import pandas as pd
from typing import Dict, Any

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "ml_model", "isolation_forest.joblib")

_model = None
if os.path.exists(MODEL_PATH):
    _model = joblib.load(MODEL_PATH)

def calculate_ml_anomaly_score(
    login_hour: int,
    geo_distance_km: float,
    is_new_device: bool,
    failed_attempts: int
) -> dict:
    """
    Predicts an anomaly score using the trained Isolation Forest model.
    Returns a dict with 'score' (0.0 to 1.0) and 'is_anomaly' (bool).
    """
    if _model is None:
        return {"score": 0.0, "is_anomaly": False}
        
    df = pd.DataFrame([{
        'login_hour': login_hour,
        'geo_distance_from_usual': geo_distance_km,
        'is_new_device': int(is_new_device),
        'failed_attempts_last_hour': failed_attempts
    }])
    
    raw_score = _model.score_samples(df)[0]
    normalized_score = min(max(-raw_score, 0.0), 1.0)
    
    # Predict returns 1 for normal, -1 for anomaly
    prediction = _model.predict(df)[0]
    is_anomaly = (prediction == -1)
    
    return {
        "score": float(normalized_score),
        "is_anomaly": is_anomaly
    }
