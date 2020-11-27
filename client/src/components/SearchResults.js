import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Search from "./Search";
import "../assets/fontawesomepro/fontawesome/all.min.css";

const SearchResults = ({}) => {
  const keyword = new URLSearchParams(useLocation().search).get("keyword");
  const host = "http://192.168.2.12:5000";
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const download = (url) => {
    window.location.href = `${host}/download?url=${url}`;
  };

  useEffect(() => {
    console.log(`${host}/search?keyword=${keyword}`);
    setIsLoading(true);
    fetch(`${host}/search?keyword=${keyword}`)
      .then((response) => {
        if (response.status !== 200) {
          console.log("Problem with response code", response.status);
          return;
        }
        response.json().then((data) => {
          const items = data.content.items.filter((result) => {
            return result.type == "video" && !result.isLive;
          });
          setResults(items);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [keyword]);

  return (
    <>
      <div id="search-wrapper">
        <Search />
      </div>
      {isLoading ? (
        <div>Loading screen</div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              height: "50px",
            }}
          >
            <div>Title</div>
            <div>Views</div>
            <div>Duration</div>
            <div>Download</div>
          </div>
          <div id="search-results-container">
            {results.map((result) => {
              console.log(result);
              return (
                <div key={`result-${result.link}`} className="search-result">
                  <img id="thumbnail" src={result.thumbnail} />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div id="title">{result.title}</div>
                    <div id="views">{result.views}</div>
                    <div id="duration">{result.duration}</div>
                    <div id="download" onClick={() => download(result.link)}>
                      <i className="far fa-download"></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default SearchResults;
