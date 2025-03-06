
import asyncio
import websockets.asyncio.server as ws_Server
from websockets.exceptions import ConnectionClosedOK

import json

def json_message(data:str, type="message"):
    """
    return standard json message of type
    {type: "type", data: "data"}
    """
    
    return json.dumps({"type": type, "data": data})

class Server:
    COMMANDS = ["-back"]
    
    def __init__(self):
        #user_list[username] = [id, password, socket, chatid = none]
        self.user_info = {}
        self.no_active_users = 0
        self.count = 0
        self.lock = asyncio.Lock()
        self.chat_logs = {}
    
    async def handle_client(self, websocket: ws_Server.ServerConnection):
        print(websocket.remote_address, "connected")
        
        #login user
        username = None 
        while not username:
            username = await self.login(websocket) 
        
        await websocket.send(json_message(f"{username} logged in"))
        while True: 
            await websocket.send(json_message("hello"))
            msg = await websocket.recv()
            print(msg)


    async def login(self, websocket: ws_Server.ServerConnection):
        """Handle User login"""
        try:
            await websocket.send(json_message("Login\nEnter Username:"))
            username = await websocket.recv()
            
            #if user exists (get password)
            if username in self.user_info.keys():
                
                await websocket.send(json_message("Enter Password", "password"))
                password = await websocket.recv()
                
                #While password is incorrect
                while(self.user_info[username][1] != password):
                    
                    if password.lower() == "-back":
                        return False
                    
                    await websocket.send(json_message("Incorrect password. Try again (or -back)"))
                    password = await websocket.recv()
                
                #password correct -> store websocket
                self.user_info[username][2] = websocket
            
            #Create new user
            else: 
                await websocket.send(json_message("New user. Create Password"))
                password = await websocket.recv()
                
                #Cannot make password reserved word
                while password in Server.COMMANDS:
                    if password.lower() == "-back":
                        return None
                    
                    await websocket.send(json_message(f"{password} is reserved, try another"))
                    password = await websocket.recv()
                    
                async with self.lock:
                    self.count += 1
                    self.user_info[username] = [self.count, password, websocket, None]
            
            async with self.lock:
                self.no_active_users += 1
                
            return username
        
        except ConnectionClosedOK:
            async with self.lock:
                self.no_active_users -= 1
                
            return
        
    async def main(self):
        async with ws_Server.serve(self.handle_client, "0.0.0.0", 1738) as server:
            await server.serve_forever()
            
if __name__ == "__main__":
    server = Server()
    
    asyncio.run(server.main())