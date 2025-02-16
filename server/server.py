import socket
import os
import threading

class Server:
    
    def __init__(self):
        
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind(("0.0.0.0", 1738))
        
        #connected_users[username] = [id, password, client_socket, chatid = none]
        self.connected_users = {}
        self.no_active_users = 0
        self.count = 0 #number of total users
        self.lock = threading.Lock()
        
        #chatlogs[chatid] = [(id, message)]
        self.chat_logs = {}
        
        
    def start_server(self):
        """
        Listen for client connections, then handle them in a thread
        """
        self.server_socket.listen(5)
        print("Server listening...")
        
        while True:
            (client_socket, addr) = self.server_socket.accept()
            print(addr, "connected")
            client_thread = threading.Thread(target=self.handle_client, args=(client_socket, addr), daemon=True)
            client_thread.start()
    
    
    def handle_client(self, client_socket: socket.socket, client_addr):
        """ 
        Handles each client
        """
        
        #If user quits before logging in
        username = self.login(client_socket)
        
        if not username: 
            return
        
        while True:
            (dest_user, chatid) = self.connect_to_chat(username, client_socket)
            
            #if user quits break
            if not self.chat(username, dest_user, chatid, client_socket):
                break
                    
        return
        
    def login(self, client_socket: socket.socket):
        """
        Handles user login
        """
        
        client_socket.send("Username: ".encode())
        username = client_socket.recv(1024).decode()
        
        if not username:
            return None #If user quits

        if username in self.connected_users.keys():
            
            client_socket.send("Passord: ".encode())
            password = client_socket.recv(1024).decode()
            
            #While password is incorrect
            while(self.connected_users[username][0] != password):
                
                client_socket.send("Incorrect Password, try again: ".encode())
                password = client_socket.recv(1024).decode()

                if not password:
                    return None #If user quits
            
            #store clients current socket
            self.connected_users[username][2] = client_socket
            
        else:
            client_socket.send("New user - Create Password:".encode())
            password = client_socket.recv(1024).decode()
            
            if not password:
                return None
            
            with self.lock: 
                self.count+=1
                self.connected_users[username] = [self.count, password, client_socket, None]
                
        self.add_user()
        return username

    def connect_to_chat(self, username, client_socket: socket.socket):
        """
        Connect a client to a chat
        
        Return:
            (dest_user, chatid)
        """
        
        client_socket.send("Enter username you would like to chat to:".encode())
        dest_user = client_socket.recv(1024).decode()
        
        if not dest_user:
            self.quit_user(username)
            return None
        
        #While user does not exist
        while dest_user not in self.connected_users.keys():
            client_socket.send("User does not exist, try again:".encode())
            dest_user = client_socket.recv(1024).decode()
            
            if not dest_user:
                self.quit_user(username)
                return
        
        #chat id is the sum of the users id's
        chatid = str(self.connected_users[username][0] + self.connected_users[dest_user][0])
        self.connected_users[username][3] = chatid
        
        return (dest_user, chatid)
        
    def chat(self, username: str, dest_user: str, chatid: str,  client_socket:socket.socket):
        
        if chatid in self.chat_logs.keys():
            logs = ""
            for (username, message) in self.chat_logs[chatid]:
                logs += f"({username}) {message}\n"

            client_socket.send(logs.encode())
        else: 
            self.chat_logs[chatid] = []
            client_socket.send(f"{username} and {dest_user} chat".encode())
        
        #main chat loop
        while True: 
            message = client_socket.recv(1024).decode()
            
            if not message:
                self.quit_user(username)
                return None
            
            if message.lower() == "--exit":
                return 1
            
            self.chat_logs[chatid].append((username, message))
            
            #send message to dest user if they are connected, and on chatid
            dest_user_socket = self.connected_users[dest_user][2]
            
            if dest_user_socket and self.connected_users[dest_user][3] == chatid:
                dest_user_socket.send(f"({username}) {message}".encode())
            
            client_socket.send(f"({username}) {message}".encode())
            
        
        
    def add_user(self):
        """
        Increment active users
        """
        with self.lock:
            self.no_active_users +=1
            
    def quit_user(self, username:str):
        """
        username quit, remove socket and decrement active users
        """
        with self.lock:
            self.no_active_users -=1
        
        self.connected_users[username][3] = None
        self.connected_users[username][2].close()
        self.connected_users[username][2] = None
                
if __name__ == "__main__":
    server = Server()
    server.start_server()