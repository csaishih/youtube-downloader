import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SearchWrapper from "./SearchWrapper";
import "../assets/fontawesomepro/fontawesome/all.min.css";

const SearchResults = ({}) => {
  const keyword = new URLSearchParams(useLocation().search).get("keyword");
  const host = "http://192.168.2.12:5000";
  const [results, setResults] = useState([]);

  const download = (url) => {
    window.location.href = `${host}/download?url=${url}`;
  };

  useEffect(() => {
    console.log(`${host}/search?keyword=${keyword}`);
    fetch(`${host}/search?keyword=${keyword}`)
      .then((response) => {
        if (response.status !== 200) {
          console.log("Problem with response code", response.status);
          return;
        }
        response.json().then((data) => {
          console.log(data.content.items);
          setResults(data.content.items);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [keyword]);

  return (
    <>
      <SearchWrapper />
      <div id="search-results-container">
        {results.map((result) => {
          console.log(result);
          return (
            <div key={`result-${result.link}`} className="search-result">
              <img id="thumbnail" src={result.thumbnail} />
              <div></div>
              <div id="title">{result.title}</div>
              <div id="views">{result.views}</div>
              <div id="duration">{result.duration}</div>
              <div id="download" onClick={() => download(result.link)}>
                <i className="far fa-download"></i>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SearchResults;
