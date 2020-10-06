import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SearchWrapper from "./components/SearchWrapper";
import SearchResults from "./components/SearchResults";

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
