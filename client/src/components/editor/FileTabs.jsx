function FileTabs({ files, activeFile, setActiveFile }) {
  return (
    <div
      style={{
        display: "flex",
        background: "#252526",
        borderBottom: "1px solid #444",
      }}
    >
      {files.map((file) => {
        const isActive = activeFile?.id === file.id;

        return (
          <div
            key={file.id}
            onClick={() => setActiveFile(file)}
            style={{
              padding: "10px 20px",
              cursor: "pointer",

              backgroundColor: isActive ? "#1e1e1e" : "#2d2d2d",

              color: isActive ? "#ffffff" : "#b3b3b3",

              borderTop: isActive
                ? "3px solid #0078d4"
                : "3px solid transparent",

              transition: "0.2s",
            }}
          >
            {file.name}
          </div>
        );
      })}
    </div>
  );
}

export default FileTabs;
