import React, { useState, useCallback } from "react";
import "./App.css";

const App = () => {
  const [link, setLink] = useState("");

  const host = "http://192.168.2.12:5000";
  // const host = "http://localhost:5000"

  const onSubmitDownload = useCallback(() => {
    window.location.href = `${host}/download?url=${link}`;
  }, [link]);

  const onChange = useCallback((e) => {
    setLink(e.target.value);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <div>
        <input
          style={{ height: "30px", width: "400px" }}
          type="text"
          value={link}
          onChange={onChange}
          placeholder="YouTube link"
        />
        <div
          style={{
            border: "1px solid black",
            marginTop: "5px",
            padding: "5px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={onSubmitDownload}
        >
          Download
        </div>
      </div>
    </div>
  );
};

export default App;
