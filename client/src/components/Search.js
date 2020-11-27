import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../assets/fontawesomepro/fontawesome/all.min.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const history = useHistory();

  const onSubmit = () => {
    if (query === "") {
      history.push(`/`);
    } else {
      history.push(`/search?keyword=${query}`);
    }
  };

  const onChange = (e) => {
    setQuery(e.target.value);
  };

  const detectEnter = (e) => {
    if (e.keyCode === 13) {
      onSubmit();
    }
  };

  return (
    <div id="search-container">
      <input
        id="search-bar"
        type="text"
        value={query}
        onChange={onChange}
        onKeyDown={detectEnter}
        placeholder="Search"
      />
      <div id="search-button" onClick={onSubmit}>
        <i className="far fa-search" />
      </div>
    </div>
  );
};

export default Search;
