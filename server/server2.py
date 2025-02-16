
import asyncio
import websockets.asyncio.server as ws_Server
from websockets.exceptions import ConnectionClosedOK

class Server:
    def __init__(self):
        pass
    
    async def handle_client(self, websocket: ws_Server.ServerConnection):
        print(websocket.remote_address, "connected")
        
        while True: 
            await websocket.send("hello")
            msg = await websocket.recv()
            print(msg)


    async def main(self):
        async with ws_Server.serve(self.handle_client, "0.0.0.0", 1738) as server:
            await server.serve_forever()


if __name__ == "__main__":
    server = Server()
    
    asyncio.run(server.main())