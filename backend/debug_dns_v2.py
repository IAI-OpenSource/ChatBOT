
import socket

print("Testing IPv6 resolution specifically:")
try:
    # AF_INET6 = 23 on Windows, but better use socket constant
    infos = socket.getaddrinfo("db.fhvybccmwsbhlilspbbi.supabase.co", 5432, socket.AF_INET6)
    print("IPv6 resolution successful:")
    for info in infos:
        print(info)
except Exception as e:
    print(f"IPv6 resolution failed: {e}")

print("\nTesting IPv4 resolution specifically:")
try:
    infos = socket.getaddrinfo("db.fhvybccmwsbhlilspbbi.supabase.co", 5432, socket.AF_INET)
    print("IPv4 resolution successful:")
    for info in infos:
        print(info)
except Exception as e:
    print(f"IPv4 resolution failed: {e}")
