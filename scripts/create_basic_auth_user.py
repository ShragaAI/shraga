#!/usr/bin/env python3
import os
import sys
import getpass
import bcrypt
import yaml
import re

def validate_email(email):
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def get_user_input():
    """Get user input for email, password and config file."""
    while True:
        email = input("Enter user email: ").strip()
        if validate_email(email):
            break
        print("Invalid email format. Please try again.")
    
    while True:
        password = getpass.getpass("Enter password: ")
        if len(password) < 8:
            print("Password must be at least 8 characters long.")
            continue
            
        confirm_password = getpass.getpass("Confirm password: ")
        if password != confirm_password:
            print("Passwords don't match. Please try again.")
            continue
        break
    
    while True:
        config_file = input("Enter config file name (e.g., config.demo.yaml): ").strip()
        if os.path.exists(config_file):
            break
        print(f"Config file '{config_file}' not found. Please try again.")
    
    return email, password, config_file

def generate_password_hash(password):
    """Generate bcrypt hash for the password."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def save_credentials(email, password, password_hash):
    """Save credentials to a text file."""
    filename = f"{email}_credentials.txt"
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"Email: {email}\n")
        f.write(f"Password: {password}\n")
        f.write(f"Password hash: {password_hash}\n")
    print(f"Credentials saved to {filename}")

def update_config_file(email, password_hash, config_file):
    """Update the config file with the new user."""
    try:
        # Load YAML content
        with open(config_file, 'r', encoding='utf-8') as f:
            config_content = f.read()
            config = yaml.safe_load(config_content)
        
        # Add user to auth users list if not already there
        if 'auth' not in config:
            config['auth'] = {}
        if 'users' not in config['auth']:
            config['auth']['users'] = []
        if email not in config['auth']['users']:
            config['auth']['users'].append(email)
        
        # Add user to basic realm
        if 'realms' not in config['auth']:
            config['auth']['realms'] = {}
        if 'basic' not in config['auth']['realms']:
            config['auth']['realms']['basic'] = []
        
        # Remove existing entry for this user if it exists
        config['auth']['realms']['basic'] = [
            entry for entry in config['auth']['realms']['basic'] 
            if not entry.startswith(f"{email}:")
        ]
        
        # Add new entry
        config['auth']['realms']['basic'].append(f"{email}:{password_hash}")
        
        # Write back to file with minimal changes
        with open(config_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Update user section
        user_updated = False
        for i, line in enumerate(lines):
            if 'auth:' in line:
                for j, subline in enumerate(lines[i+1:], i+1):
                    if 'users:' in subline and not user_updated:
                        indent = len(subline) - len(subline.lstrip())
                        # Check if user is already in the list
                        user_exists = False
                        for k, userline in enumerate(lines[j+1:], j+1):
                            if not userline.strip().startswith('-') or len(userline) - len(userline.lstrip()) != indent + 2:
                                break
                            if email in userline:
                                user_exists = True
                                break
                        if not user_exists:
                            # Insert user at end of users list
                            insert_position = j+1
                            while insert_position < len(lines) and (insert_position == j+1 or len(lines[insert_position-1]) - len(lines[insert_position-1].lstrip()) == indent + 2):
                                insert_position += 1
                            lines.insert(insert_position, ' ' * (indent + 2) + f'- {email}\n')
                        user_updated = True
                        break

        # Update basic realm section
        basic_updated = False
        for i, line in enumerate(lines):
            if 'realms:' in line:
                for j, subline in enumerate(lines[i+1:], i+1):
                    if 'basic:' in subline and not basic_updated:
                        indent = len(subline) - len(subline.lstrip())
                        # Check if credential is already in the list
                        cred_exists = False
                        insert_position = j+1
                        for k, credline in enumerate(lines[j+1:], j+1):
                            if len(credline.strip()) == 0 or len(credline) - len(credline.lstrip()) <= indent:
                                insert_position = k
                                break
                            if email in credline:
                                lines[k] = ' ' * (indent + 2) + f'- {email}:{password_hash}\n'
                                cred_exists = True
                                break
                            insert_position = k+1
                        if not cred_exists:
                            # Insert credential
                            lines.insert(insert_position, ' ' * (indent + 2) + f'- {email}:{password_hash}\n')
                        basic_updated = True
                        break
        
        # Write back the modified lines
        with open(config_file, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
        print(f"Config file {config_file} updated successfully.")
    except (IOError, yaml.YAMLError, KeyError) as e:
        print(f"Error updating config file: {e}")
        sys.exit(1)

def main():
    print("=== Basic Auth User Creation ===")
    email, password, config_file = get_user_input()
    
    # Generate password hash
    password_hash = generate_password_hash(password)
    
    # Save credentials to file
    save_credentials(email, password, password_hash)
    
    # Update config file
    update_config_file(email, password_hash, config_file)
    
    print(f"\nUser {email} has been added successfully!")
    print("Remember to restart your application for changes to take effect.")

if __name__ == "__main__":
    main()