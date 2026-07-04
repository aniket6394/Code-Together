import { useState } from "react";
import "../css/Home.css";

import api from "../api/api";
import { useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const createRoom = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    try {
      const response = await api.post("/create-room");

      // Store username
      localStorage.setItem("username", username);

      // Navigate to editor
      navigate(`/editor/${response.data.roomId}`);
    } catch (error) {
      console.log(error);
    }
  };
  const joinRoom = () => {
    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    if (!roomId.trim()) {
      alert("Enter room ID");
      return;
    }

    localStorage.setItem("username", username);

    navigate(`/editor/${roomId}`);
  };
  return (
    <div className="home">
      <div className="card">
        <h1>Code Sync</h1>

        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button onClick={createRoom}>Create Room</button>

        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default Home;
