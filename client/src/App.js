import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Search from "./components/Search";
import SearchResults from "./components/SearchResults";

const SearchWrapper = () => {
  return (
    <div className="center">
      <Search />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" children={<SearchWrapper />} />
        <Route path="/search" children={<SearchResults />} />
      </Switch>
    </Router>
  );
};

export default App;
