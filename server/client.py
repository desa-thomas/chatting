import socket
import threading

def listen():
    while True: 
        data = server.recv(1024).decode()
        print(f"{data}")
    
def input_func(server:socket.socket):
    while True: 
        msg = input("->")
        
        if not msg:
            continue
        
        if msg.lower() == "quit":
            break
        
        server.send(msg.encode())


server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.connect(("localhost", 1738))
    
thread = threading.Thread(target=listen, daemon=True)
thread.start()

input_func(server)
server.close()
