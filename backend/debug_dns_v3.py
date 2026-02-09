
import socket

hostname = "aws-0-eu-central-1.pooler.supabase.com" # Wait, the user provided aws-1-eu-west-1.pooler.supabase.com?
# Let me double check the user input.
# User input: postgresql://postgres.fhvybccmwsbhlilspbbi:[YOUR-PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:6543/postgres
# Okay, I will test aws-1-eu-west-1.pooler.supabase.com

hostname = "aws-1-eu-west-1.pooler.supabase.com"

print(f"Testing IPv4 resolution for {hostname}:")
try:
    infos = socket.getaddrinfo(hostname, 6543, socket.AF_INET)
    print("IPv4 resolution successful:")
    for info in infos:
        print(info)
except Exception as e:
    print(f"IPv4 resolution failed: {e}")
