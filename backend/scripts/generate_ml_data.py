import pandas as pd
import numpy as np
import os
from sklearn.ensemble import IsolationForest
import joblib

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "app", "ml_model", "isolation_forest.joblib")
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

def generate_synthetic_data(num_samples=1000):
    """
    Generates synthetic login feature data for training the Isolation Forest model.
    Features: [login_hour, geo_distance_from_usual, is_new_device, failed_attempts_last_hour]
    """
    np.random.seed(42)
    
    # 90% Normal behavior
    normal_samples = int(num_samples * 0.9)
    # 10% Anomalous behavior (attacks, compromised accounts)
    anomalous_samples = num_samples - normal_samples
    
    # Normal Data Generation
    # login_hour: Mostly daytime hours (8 to 20), some evening
    normal_hour = np.random.normal(loc=14, scale=3, size=normal_samples).clip(0, 23).astype(int)
    # geo_distance: Mostly close to usual city (0 to 50 km)
    normal_distance = np.random.exponential(scale=10, size=normal_samples)
    # is_new_device: Mostly false (0)
    normal_device = np.random.choice([0, 1], size=normal_samples, p=[0.95, 0.05])
    # failed_attempts: Mostly 0, rarely 1 or 2
    normal_fails = np.random.choice([0, 1, 2], size=normal_samples, p=[0.90, 0.08, 0.02])
    
    # Anomalous Data Generation
    # login_hour: Often late night / early morning (0 to 5) or completely random
    anomalous_hour = np.random.choice(range(0, 24), size=anomalous_samples)
    # geo_distance: Often far away (100 to 10000 km)
    anomalous_distance = np.random.uniform(low=100, high=8000, size=anomalous_samples)
    # is_new_device: Mostly true (1)
    anomalous_device = np.random.choice([0, 1], size=anomalous_samples, p=[0.2, 0.8])
    # failed_attempts: Often high (3 to 15)
    anomalous_fails = np.random.randint(low=3, high=15, size=anomalous_samples)
    
    # Combine data
    hours = np.concatenate([normal_hour, anomalous_hour])
    distances = np.concatenate([normal_distance, anomalous_distance])
    devices = np.concatenate([normal_device, anomalous_device])
    fails = np.concatenate([normal_fails, anomalous_fails])
    
    df = pd.DataFrame({
        'login_hour': hours,
        'geo_distance_from_usual': distances,
        'is_new_device': devices,
        'failed_attempts_last_hour': fails
    })
    
    # Shuffle dataset
    df = df.sample(frac=1).reset_index(drop=True)
    return df

def train_model():
    print("Generating synthetic data...")
    df = generate_synthetic_data(5000)
    
    print("Training Isolation Forest model...")
    # contamination = expected proportion of outliers
    model = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    
    # We fit the model on the generated data
    model.fit(df)
    
    # Save the model
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
