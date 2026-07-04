import ActivityBar from "./ActivityBar";
import FileExplorer from "./FileExplorer";
import UserCard from "./UserCard";
import ChatPanel from "./ChatPanel";
import UserPanel from "./UserPanel";
function Sidebar({
  roomId,
  users,
  files,
  activeFile,
  setActiveFile,
  activeSidebar,
  setActiveSidebar,
  messages,
  username,
}) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ActivityBar
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
      />

      <div
        style={{
          width: "250px",
          background: "#252526",
          color: "white",
          padding: "10px",
        }}
      >
        {activeSidebar === "files" && (
          <FileExplorer
            roomId={roomId}
            files={files}
            activeFile={activeFile}
            setActiveFile={setActiveFile}
          />
        )}

        {activeSidebar === "users" && <UserPanel users={users} />}

        {activeSidebar === "chat" && (
          <ChatPanel roomId={roomId} username={username} messages={messages} />
        )}
      </div>
    </div>
  );
}

export default Sidebar;
