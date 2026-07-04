import { useEffect, useState } from "react";
import socket from "../socket/socket";
import CodeEditor from "../components/editor/CodeEditor";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar/SideBar";
function Editor() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "main.cpp",
      content: "#include<iostream>\n\nint main(){\n\n}",
    },
    {
      id: 2,
      name: "graph.cpp",
      content: "// Graph Algorithms",
    },
  ]);
  const [activeFile, setActiveFile] = useState(files[0]);
  const [users, setUsers] = useState([]);
  const { roomId } = useParams();

  const username = localStorage.getItem("username");
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("join-room", {
        roomId,
        username,
      });
    });

    socket.on("room-users", (users) => {
      setUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off("room-users");
      socket.disconnect();
    };
  }, [roomId, username]);
  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        users={users}
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
      />

      <div style={{ flex: 1 }}>
        <CodeEditor roomId={roomId} />
      </div>
    </div>
  );
}

export default Editor;
