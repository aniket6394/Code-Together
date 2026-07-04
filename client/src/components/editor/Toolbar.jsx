import toast from "react-hot-toast";
import { downloadProject } from "./donwloadProject";
function Toolbar({
  language,
  theme,
  onLanguageChange,
  onThemeChange,
  roomId,
  files,
}) {
  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    toast.success("Room Id copied");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #444",
        background: "#1e1e1e",
      }}
    >
      <div style={{ display: "flex", gap: "15px" }}>
        <select value={language} onChange={onLanguageChange}>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <select value={theme} onChange={onThemeChange}>
          <option value="vscodeDark">VS Code Dark</option>
          <option value="githubLight">GitHub Light</option>
          <option value="dracula">Dracula</option>
        </select>
      </div>
      <button onClick={() => downloadProject(files)}>📦 Download</button>
      <button onClick={copyRoomId}>Copy Room ID</button>
    </div>
  );
}

export default Toolbar;
