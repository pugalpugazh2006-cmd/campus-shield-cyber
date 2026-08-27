import requests
import time
import random

BASE_URL = "http://localhost:8000/api/v1"

def simulate_brute_force():
    print("--- Starting Simulated Brute Force Attack ---")
    
    # 1. Register a victim user
    victim_data = {
        "email": f"victim_{random.randint(100,999)}@campus.edu",
        "name": "Student Victim",
        "password": "securepassword123",
        "role": "student",
        "usual_city": "New York"
    }
    print(f"[*] Registering victim user: {victim_data['email']}")
    reg_response = requests.post(f"{BASE_URL}/auth/register", json=victim_data)
    
    if reg_response.status_code == 200:
        print("[+] Victim registered successfully.")
    else:
        print(f"[-] Registration failed: {reg_response.text}")
        return

    time.sleep(1)

    # 2. Attack: Send 6 failed login attempts rapidly
    print("\n[*] Commencing brute force attack (6 failed logins)...")
    attacker_headers = {
        "user-agent": "KaliLinux/Hydra-Attacker-Tool"
    }
    
    for i in range(1, 7):
        print(f"  -> Attempt {i}: Trying password 'password123'")
        login_data = {
            "username": victim_data["email"],
            "password": "wrongpassword"
        }
        # Using form data as required by OAuth2PasswordRequestForm
        response = requests.post(f"{BASE_URL}/auth/login", data=login_data, headers=attacker_headers)
        
        if response.status_code == 400:
            print(f"     [Failed] (Expected)")
        
        time.sleep(0.5) # Slight delay between attempts
        
    print("\n[+] Brute force sequence complete.")
    print("[*] The system should have calculated a high risk score, flagged the new device, and generated a 'brute_force' and 'high_risk_login' alert in the database!")
    print("\n--- Check the Dashboard / Database for Alerts! ---")

if __name__ == "__main__":
    try:
        simulate_brute_force()
    except requests.exceptions.ConnectionError:
        print("[-] Error: Could not connect to the backend API. Make sure the FastAPI server is running on http://localhost:8000")
