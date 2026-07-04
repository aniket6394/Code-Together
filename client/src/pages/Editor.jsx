import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket/socket";
import Sidebar from "../components/sidebar/SideBar";
import CodeEditor from "../components/editor/CodeEditor";

function Editor() {
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState("files");
  const [activeFile, setActiveFile] = useState(null);
  const [users, setUsers] = useState([]);
  const previousUsers = useRef([]);
  const { roomId } = useParams();
  const username = localStorage.getItem("username");
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, []);
  useEffect(() => {
    const handleFilesUpdated = (updatedFiles) => {
      setFiles(updatedFiles);

      const updatedActive = updatedFiles.find(
        (file) => file.id === activeFile?.id,
      );

      if (updatedActive) {
        setActiveFile(updatedActive);
      }
    };

    socket.on("files-updated", handleFilesUpdated);

    return () => {
      socket.off("files-updated", handleFilesUpdated);
    };
  }, [activeFile]);
  useEffect(() => {
    const handleFileCreated = (updatedFiles) => {
      setFiles(updatedFiles);
    };

    socket.on("file-created", handleFileCreated);

    return () => {
      socket.off("file-created", handleFileCreated);
    };
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Connected:", socket.id);

      socket.emit("join-room", {
        roomId,
        username,
      });
    });

    socket.on("room-users", (newUsers) => {
      console.log(users);
      const oldUsers = previousUsers.current;

      // Joined user
      if (newUsers.length > oldUsers.length) {
        const joinedUser = newUsers.find(
          (u) => !oldUsers.some((old) => old.socketId === u.socketId),
        );

        if (joinedUser) {
          toast.success(`${joinedUser.username} joined the room`);
        }
      }

      // Left user
      if (newUsers.length < oldUsers.length) {
        const leftUser = oldUsers.find(
          (old) => !newUsers.some((u) => u.socketId === old.socketId),
        );

        if (leftUser) {
          toast(`${leftUser.username} left the room`, {
            icon: "👋",
          });
        }
      }

      previousUsers.current = newUsers;
      setUsers(newUsers);
    });
    // Receive files from backend
    socket.on("receive-files", (serverFiles) => {
      console.log(serverFiles);

      setFiles(serverFiles);

      if (serverFiles.length > 0) {
        setActiveFile(serverFiles[0]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("room-users");
      socket.off("receive-files");
      socket.disconnect();
    };
  }, [roomId, username]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        roomId={roomId}
        users={users}
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
        messages={messages}
        username={username}
      />

      <div style={{ flex: 1 }}>
        {activeFile && (
          <CodeEditor
            roomId={roomId}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
            files={files}
            setFiles={setFiles}
            users={users}
            username={username}
          />
        )}
      </div>
    </div>
  );
}

export default Editor;
