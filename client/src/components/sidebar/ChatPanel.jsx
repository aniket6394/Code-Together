import { useState } from "react";
import socket from "../../socket/socket";
function ChatPanel({ roomId, username, messages }) {
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      message: {
        id: crypto.randomUUID(),
        username,
        text: message,
        time: new Date().toLocaleTimeString(),
      },
    });

    setMessage("");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <h3>Room Chat</h3>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "15px",
              background: "#2d2d2d",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <strong>{msg.username}</strong>

            <div
              style={{
                marginTop: "5px",
              }}
            >
              {msg.text}
            </div>

            <small
              style={{
                color: "#aaa",
              }}
            >
              {msg.time}
            </small>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            outline: "none",
          }}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatPanel;
