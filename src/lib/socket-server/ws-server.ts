import { WebSocketServer, type RawData, type WebSocket } from "ws";
import dotenv from "dotenv";
dotenv.config();

const PORT = parseInt(process.env.WS_PORT ?? "3001", 10);

const wss = new WebSocketServer({ port: PORT });

const clients = new Map<string, Set<WebSocket>>();

wss.on("connection", (socket) => {
  console.log("Client connected");
  socket.once("message", (raw: RawData) => {
    const msg = JSON.parse(raw.toString());
    const userId: string = msg.userId;
    if (!clients.has(userId)) clients.set(userId, new Set());
    clients.get(userId)!.add(socket);

    socket.on("close", () => {
      const conns = clients.get(userId)!;
      conns.delete(socket);
      if (conns.size === 0) clients.delete(userId);
    });
  });
});

export function sendNotification(userId: string, payload: any): void {
  const conns = clients.get(userId);
  if (!conns) return;
  const message = JSON.stringify({
    type: "NEW_NOTIFICATION",
    notification: payload, // Changed from spreading payload
  });
  for (const ws of conns) {
    if (ws.readyState === ws.OPEN) {
      ws.send(message);
    }
  }
}

wss.on("listening", () => {
  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}`);
});
