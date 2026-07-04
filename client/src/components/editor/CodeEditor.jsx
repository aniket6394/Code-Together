import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";

import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import Toolbar from "./Toolbar";
import { vscodeDark, githubLight, dracula } from "@uiw/codemirror-themes-all";

import socket from "../../socket/socket";

function CodeEditor({ roomId }) {
  const [code, setCode] = useState("// Start Coding...\n");
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vscodeDark");

  // Receive Code
  useEffect(() => {
    const handleReceiveCode = (newCode) => {
      setCode(newCode);
    };

    socket.on("receive-code", handleReceiveCode);

    return () => {
      socket.off("receive-code", handleReceiveCode);
    };
  }, []);

  // Receive Language
  useEffect(() => {
    const handleReceiveLanguage = (lang) => {
      setLanguage(lang);
    };

    socket.on("receive-language", handleReceiveLanguage);

    return () => {
      socket.off("receive-language", handleReceiveLanguage);
    };
  }, []);

  // Receive Theme
  useEffect(() => {
    const handleReceiveTheme = (newTheme) => {
      setTheme(newTheme);
    };

    socket.on("receive-theme", handleReceiveTheme);

    return () => {
      socket.off("receive-theme", handleReceiveTheme);
    };
  }, []);

  // Language Extension
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

  // Theme
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

  // Code Change
  const handleCodeChange = (value) => {
    setCode(value);

    socket.emit("code-change", {
      roomId,
      code: value,
    });
  };

  // Language Change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;

    setLanguage(newLanguage);

    socket.emit("language-change", {
      roomId,
      language: newLanguage,
    });
  };

  // Theme Change
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;

    setTheme(newTheme);

    socket.emit("theme-change", {
      roomId,
      theme: newTheme,
    });
  };

  return (
    <>
      <Toolbar
        language={language}
        theme={theme}
        roomId={roomId}
        onLanguageChange={handleLanguageChange}
        onThemeChange={handleThemeChange}
      />

      <CodeMirror
        value={code}
        height="90vh"
        theme={editorTheme}
        extensions={[languageExtension]}
        onChange={handleCodeChange}
      />
    </>
  );
}

export default CodeEditor;
