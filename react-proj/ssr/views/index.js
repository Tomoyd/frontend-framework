import React from "react";
import ReactDom from "react-dom";

import Home from "./Home";

const App = () => {
  return <Home></Home>;
};
ReactDom.hydrate(<App />, document.getElementById("root"));
