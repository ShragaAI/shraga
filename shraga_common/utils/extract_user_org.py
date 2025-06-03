def extract_user_org(user_id: str) -> str:
    common_domains = {
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
        'icloud.com', 'aol.com', 'mail.com', 'protonmail.com',
        'proton.me', 'live.com', 'msn.com'
    }
    
    if not user_id or '@' not in user_id:
        return ""
    
    parts = user_id.split('@')
    if len(parts) != 2:
        return ""
    
    domain = parts[1].lower().strip()
    
    if domain in common_domains:
        return ""
    
    return domain