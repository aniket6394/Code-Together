import FileExplorer from "./FileExplorer";
import UserCard from "./Usercard";

function Sidebar({ users, files, activeFile, setActiveFile }) {
  console.log(users);
  return (
    <div
      style={{
        width: "250px",
        background: "#1f1f1f",
        color: "white",
        padding: "20px",
      }}
    >
      <FileExplorer
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
      />

      <hr />

      <h2>Connected Users</h2>

      {users.map((user) => (
        <UserCard key={user.socketId} user={user} />
      ))}
    </div>
  );
}

export default Sidebar;
