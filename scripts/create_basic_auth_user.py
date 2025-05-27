#!/usr/bin/env python3
import os
import sys
import getpass
import bcrypt
import re
import argparse

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

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Create a basic auth user and add to config file.')
    parser.add_argument('email', nargs='?', help='User email address')
    parser.add_argument('password', nargs='?', help='User password')
    parser.add_argument('config_file', nargs='?', help='Config file name (e.g., config.demo.yaml)')
    return parser.parse_args()

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
        # Use PyYAML with ordered dictionaries to maintain field order
        import yaml
        from collections import OrderedDict
        
        # Configure PyYAML to use OrderedDict for mappings
        def ordered_yaml_load(stream):
            class OrderedLoader(yaml.SafeLoader):
                pass
            
            def construct_mapping(loader, node):
                loader.flatten_mapping(node)
                return OrderedDict(loader.construct_pairs(node))
                
            OrderedLoader.add_constructor(
                yaml.resolver.Resolver.DEFAULT_MAPPING_TAG,
                construct_mapping)
            return yaml.load(stream, OrderedLoader)
        
        def ordered_yaml_dump(data, stream):
            class OrderedDumper(yaml.SafeDumper):
                pass
                
            def _dict_representer(dumper, data):
                return dumper.represent_mapping(
                    yaml.resolver.Resolver.DEFAULT_MAPPING_TAG,
                    data.items())
                    
            OrderedDumper.add_representer(OrderedDict, _dict_representer)
            return yaml.dump(data, stream, OrderedDumper, default_flow_style=False)
        
        # Load YAML content with order preserved
        with open(config_file, 'r', encoding='utf-8') as f:
            config = ordered_yaml_load(f)
            
        # Convert to OrderedDict if not already
        if not isinstance(config, OrderedDict):
            config = OrderedDict(config)
            
        # Ensure auth section is an OrderedDict
        if 'auth' not in config:
            config['auth'] = OrderedDict()
        elif not isinstance(config['auth'], OrderedDict):
            config['auth'] = OrderedDict(config['auth'])
            
        # Add user to auth users list if not already
        if 'users' not in config['auth']:
            config['auth']['users'] = []
        if email not in config['auth']['users']:
            config['auth']['users'].append(email)
        
        # Add user to basic realm
        if 'realms' not in config['auth']:
            config['auth']['realms'] = OrderedDict()
        elif not isinstance(config['auth']['realms'], OrderedDict):
            config['auth']['realms'] = OrderedDict(config['auth']['realms'])
            
        if 'basic' not in config['auth']['realms']:
            config['auth']['realms']['basic'] = []
        
        # Remove existing entry for this user if it exists
        config['auth']['realms']['basic'] = [
            entry for entry in config['auth']['realms']['basic'] 
            if not entry.startswith(f"{email}:")
        ]
        
        # Add new entry
        config['auth']['realms']['basic'].append(f"{email}:{password_hash}")
        
        # Write back to file
        with open(config_file, 'w', encoding='utf-8') as f:
            ordered_yaml_dump(config, f)
            
        print(f"Config file {config_file} updated successfully.")
    except Exception as e:
        print(f"Error updating config file: {e}")
        sys.exit(1)

def main():
    print("=== Basic Auth User Creation ===")
    
    # Parse command line arguments
    args = parse_args()
    
    # If all arguments are provided, use them directly
    if args.email and args.password and args.config_file:
        email = args.email
        password = args.password
        config_file = args.config_file
        
        # Validate inputs
        if not validate_email(email):
            print(f"Invalid email format: {email}")
            sys.exit(1)
        
        if len(password) < 8:
            print("Password must be at least 8 characters long.")
            sys.exit(1)
            
        if not os.path.exists(config_file):
            print(f"Config file '{config_file}' not found.")
            sys.exit(1)
    else:
        # If any argument is missing, switch to interactive mode
        email, password, config_file = get_user_input()
    
    # Generate password hash
    password_hash = generate_password_hash(password)
    
    # Save credentials to file
    save_credentials(email, password, password_hash)
    
    # Update config file
    update_config_file(email, password_hash, config_file)
    
    print(f"\nUser {email} has been added successfully!")
    print("Remember to restart your application for changes to take effect.")

def cli_entrypoint():
    """Entry point for Poetry-installed CLI command."""
    main()

if __name__ == "__main__":
    main()