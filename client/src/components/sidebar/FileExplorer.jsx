import toast from "react-hot-toast";
import socket from "../../socket/socket";
function FileExplorer({ files, activeFile, setActiveFile, roomId }) {
  const renameFile = (file) => {
    const newName = prompt("New file name", file.name);

    if (!newName) return;

    socket.emit("rename-file", {
      roomId,

      fileId: file.id,

      newName,
    });
    toast.success("File renamed");
  };
  const handleCreateFile = async () => {
    const name = prompt("Enter file name");

    if (!name) return;

    const file = {
      id: crypto.randomUUID(),
      name,
      content: "",
    };

    socket.emit("create-file", {
      roomId,
      file,
    });
    toast.success(`${file.name} created`);
  };
  return (
    <>
      <h3>Explorer</h3>
      <button onClick={handleCreateFile}>+ New File</button>

      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => setActiveFile(file)}
          style={{
            padding: "10px",
            cursor: "pointer",
            background: activeFile.id === file.id ? "#333" : "transparent",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span onClick={() => setActiveFile(file)}>📄 {file.name}</span>

            <button onClick={() => renameFile(file)}>✏️</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default FileExplorer;
