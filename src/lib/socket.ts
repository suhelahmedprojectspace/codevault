let socket: WebSocket | null = null;

export function connectWebSocket(userId: string) {
  if (socket) {
    socket.close();
  }
  socket = new WebSocket("ws://localhost:3001");

  socket.onopen = () => {
    console.log("🟢 Connected to WebSocket");
    socket?.send(JSON.stringify({ userId }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "NEW_NOTIFICATION") {
      console.log("🔔 Notification received:", data.notification);
      // Dispatch custom event to trigger UI update
      window.dispatchEvent(new CustomEvent("new-notification"));
    }
  };
  socket.onclose = () => console.log("🔴 WebSocket disconnected");
  socket.onerror = (err) => console.error("WebSocket error:", err);
}
