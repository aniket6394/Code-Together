import { VscFiles, VscAccount, VscCommentDiscussion } from "react-icons/vsc";

function ActivityBar({ activeSidebar, setActiveSidebar }) {
  return (
    <div
      style={{
        width: "55px",
        background: "#181818",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "15px",
        gap: "20px",
      }}
    >
      <VscFiles
        size={28}
        color={activeSidebar === "files" ? "#fff" : "#888"}
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSidebar("files")}
      />

      <VscAccount
        size={28}
        color={activeSidebar === "users" ? "#fff" : "#888"}
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSidebar("users")}
      />

      <VscCommentDiscussion
        size={28}
        color={activeSidebar === "chat" ? "#fff" : "#888"}
        style={{ cursor: "pointer" }}
        onClick={() => setActiveSidebar("chat")}
      />
    </div>
  );
}

export default ActivityBar;
