import React from "react";
import Routes from "./Router/Routes";

function App() {
  if (true) {
    console.log = function no_console() {};
  }
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
