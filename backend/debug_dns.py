
import socket
try:
    print("Attempting to gethostbyname:")
    print(socket.gethostbyname("db.fhvybccmwsbhlilspbbi.supabase.co"))
except Exception as e:
    print(f"gethostbyname failed: {e}")

try:
    print("\nAttempting to getaddrinfo:")
    for res in socket.getaddrinfo("db.fhvybccmwsbhlilspbbi.supabase.co", 5432):
        print(res)
except Exception as e:
    print(f"getaddrinfo failed: {e}")
