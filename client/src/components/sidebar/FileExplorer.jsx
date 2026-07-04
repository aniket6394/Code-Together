function FileExplorer({ files, activeFile, setActiveFile }) {
  return (
    <>
      <h3>Explorer</h3>

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
          📄 {file.name}
        </div>
      ))}
    </>
  );
}

export default FileExplorer;
