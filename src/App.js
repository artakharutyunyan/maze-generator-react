import React, { Component } from "react";

import Cell from "./Cell.js";
import "./style.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
    };
  }

  render() {
    const walls = {
      left: true,
      right: true,
      top: true,
      bottom: true,
    };
    return (
      <div>
        <p>Maze Generation</p>
        <Cell walls={walls} />
      </div>
    );
  }
}

export default App;
