import React, { useState, useCallback } from "react";
import "./App.css";

const App = () => {
  const [link, setLink] = useState("");

  const onSubmitAudio = useCallback(() => {
    // window.location.href = `http://localhost:5000/download?url=${link}`;
    window.location.href = `http://localhost:5000/download/audio?url=${link}`;
  }, [link]);

  const onSubmitVideo = useCallback(() => {
    window.location.href = `http://localhost:5000/download/video?url=${link}`;
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
          onClick={onSubmitAudio}
        >
          Download audio
        </div>
        <div
          style={{
            border: "1px solid black",
            marginTop: "5px",
            padding: "5px",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={onSubmitVideo}
        >
          Download video
        </div>
      </div>
    </div>
  );
};

export default App;
