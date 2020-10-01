import React, { useState, useCallback } from "react";
import "./App.css";

const App = () => {
  const [link, setLink] = useState("");

  const onSubmit = useCallback(
    (e) => {
      console.log(link);
      window.location.href = `http://localhost:5000/download?url=${link}`;
    },
    [link]
  );

  const onChange = useCallback((e) => {
    setLink(e.target.value);
  }, []);

  return (
    <div>
      <input
        type="text"
        value={link}
        onChange={onChange}
        placeholder="YouTube link"
      />
      <div onClick={onSubmit}>Download</div>
    </div>
  );
};

export default App;
