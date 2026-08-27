import re
from urllib.parse import urlparse

# A list of known good domains to check against typosquatting
KNOWN_GOOD_DOMAINS = ["google.com", "microsoft.com", "github.com", "campus.edu"]

# Suspicious TLDs often used in phishing
SUSPICIOUS_TLDS = [".xyz", ".top", ".pw", ".tk", ".ml", ".ga", ".cf", ".gq"]

def levenshtein_distance(s1: str, s2: str) -> int:
    """
    Calculates the Levenshtein distance (edit distance) between two strings.
    """
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

def check_url_for_phishing(url: str) -> dict:
    """
    Performs heuristic checks on a URL to determine if it might be a phishing link.
    
    Heuristics included:
    - Suspicious TLDs
    - IP address used as the hostname instead of a domain name
    - Typosquatting (Levenshtein distance against known good domains)
    """
    is_phishing = False
    reasons = []
    
    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname or ""
        
        # 1. Check for IP-literal URLs (e.g., http://192.168.1.1/login)
        # Simple regex to check if hostname looks like an IPv4 address
        if re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname):
            is_phishing = True
            reasons.append("IP address used instead of domain name.")
            
        # 2. Check for suspicious TLDs
        if any(hostname.endswith(tld) for tld in SUSPICIOUS_TLDS):
            is_phishing = True
            reasons.append("Suspicious Top-Level Domain (TLD) detected.")
            
        # 3. Check for Typosquatting
        # Compare against known domains. If the edit distance is 1, it's highly suspicious.
        # (e.g., 'gogle.com' vs 'google.com')
        for good_domain in KNOWN_GOOD_DOMAINS:
            if hostname == good_domain:
                continue # Exact match is fine
            
            # If the lengths are similar, check the distance
            if abs(len(hostname) - len(good_domain)) <= 2:
                dist = levenshtein_distance(hostname, good_domain)
                if dist == 1:
                    is_phishing = True
                    reasons.append(f"Potential typosquatting of {good_domain}.")
                    break

    except Exception as e:
        is_phishing = True
        reasons.append(f"Failed to parse URL: {str(e)}")

    return {
        "is_suspicious": is_phishing,
        "reasons": reasons
    }
