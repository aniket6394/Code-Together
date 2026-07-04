import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import toast from "react-hot-toast";
import { createSelectionPlugin } from "./selectionDecoration";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import FileTabs from "./FileTabs";
import { vscodeDark, githubLight, dracula } from "@uiw/codemirror-themes-all";
import { createCursorPlugin } from "./curserDecoration";
import Toolbar from "./Toolbar";
import socket from "../../socket/socket";

function CodeEditor({
  roomId,
  activeFile,
  setActiveFile,
  files,
  setFiles,
  users,
  username,
}) {
  const [remoteSelections, setRemoteSelections] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vscodeDark");
  const [remoteCursors, setRemoteCursors] = useState([]);
  // =======================
  // Receive Code
  // =======================

  useEffect(() => {
    const handleReceiveCode = ({ fileId, code }) => {
      setFiles((prevFiles) => {
        const updatedFiles = prevFiles.map((file) =>
          file.id === fileId ? { ...file, content: code } : file,
        );

        const updatedActive = updatedFiles.find(
          (file) => file.id === activeFile.id,
        );

        if (updatedActive) {
          setActiveFile(updatedActive);
        }

        return updatedFiles;
      });
    };

    socket.on("receive-code", handleReceiveCode);

    return () => {
      socket.off("receive-code", handleReceiveCode);
    };
  }, [activeFile, setFiles, setActiveFile]);

  // =======================
  // Receive Language
  // =======================

  useEffect(() => {
    const handleReceiveLanguage = (lang) => {
      setLanguage(lang);
    };

    socket.on("receive-language", handleReceiveLanguage);

    return () => {
      socket.off("receive-language", handleReceiveLanguage);
    };
  }, []);

  // =======================
  // Receive Theme
  // =======================
  useEffect(() => {
    const handleReceiveCursor = (data) => {
      setRemoteCursors((prev) => {
        const filtered = prev.filter((c) => c.username !== data.username);

        return [...filtered, data];
      });
    };

    socket.on("receive-cursor", handleReceiveCursor);

    return () => {
      socket.off("receive-cursor", handleReceiveCursor);
    };
  }, []);
  useEffect(() => {
    const handleReceiveTheme = (newTheme) => {
      setTheme(newTheme);
    };

    socket.on("receive-theme", handleReceiveTheme);

    return () => {
      socket.off("receive-theme", handleReceiveTheme);
    };
  }, []);

  // =======================
  // Language Extension
  // =======================

  const languageExtension = useMemo(() => {
    switch (language) {
      case "cpp":
        return cpp();

      case "java":
        return java();

      case "python":
        return python();

      default:
        return javascript();
    }
  }, [language]);

  // =======================
  // Theme
  // =======================

  const editorTheme = useMemo(() => {
    switch (theme) {
      case "githubLight":
        return githubLight;

      case "dracula":
        return dracula;

      default:
        return vscodeDark;
    }
  }, [theme]);

  // =======================
  // Code Change
  // =======================

  const handleCodeChange = (value) => {
    const updatedFile = {
      ...activeFile,
      content: value,
    };

    setActiveFile(updatedFile);

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === updatedFile.id ? updatedFile : file,
      ),
    );

    socket.emit("code-change", {
      roomId,
      fileId: updatedFile.id,
      code: value,
    });
  };

  // =======================
  // Language Change
  // =======================

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    socket.emit("language-change", {
      roomId,
      language: newLanguage,
    });
    toast.success(`Language changed to ${newLanguage}`);
  };

  // =======================
  // Theme Change
  // =======================
  useEffect(() => {
    const handleSelection = (data) => {
      setRemoteSelections((prev) => {
        const filtered = prev.filter((u) => u.username !== data.username);

        return [...filtered, data];
      });
    };

    socket.on("receive-selection", handleSelection);

    return () => {
      socket.off("receive-selection", handleSelection);
    };
  }, []);
  useEffect(() => {
    const handleSelection = (data) => {
      setRemoteSelections((prev) => {
        const filtered = prev.filter((u) => u.username !== data.username);

        return [...filtered, data];
      });
    };

    socket.on("receive-selection", handleSelection);

    return () => {
      socket.off("receive-selection", handleSelection);
    };
  }, []);
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;

    setTheme(newTheme);

    socket.emit("theme-change", {
      roomId,
      theme: newTheme,
    });
    toast.success("Theme changed");
  };
  const cursorListener = EditorView.updateListener.of((update) => {
    if (!update.selectionSet) return;

    const cursorPosition = update.state.selection.main.head;
    const selection = update.state.selection.main;
    const me = users.find((u) => u.socketId === socket.id);
    socket.emit("selection-change", {
      roomId,
      fileId: activeFile.id,
      username: username,
      color: me.color,
      from: selection.from,
      to: selection.to,
    });

    socket.emit("cursor-change", {
      roomId,
      fileId: activeFile.id,
      cursorPosition,
      username,
      color: me.color,
    });
  });

  return (
    <>
      <FileTabs
        files={files}
        activeFile={activeFile}
        setActiveFile={setActiveFile}
      />
      <Toolbar
        language={language}
        theme={theme}
        roomId={roomId}
        onLanguageChange={handleLanguageChange}
        onThemeChange={handleThemeChange}
        files={files}
      />

      <CodeMirror
        value={activeFile.content}
        height="90vh"
        theme={editorTheme}
        extensions={[
          languageExtension,
          cursorListener,
          createCursorPlugin(remoteCursors),
          createSelectionPlugin(remoteSelections),
        ]}
        onChange={handleCodeChange}
      />
    </>
  );
}

export default CodeEditor;
