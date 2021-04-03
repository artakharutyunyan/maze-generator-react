import React, { Component } from "react";

import Row from "./Row.js";
import "./style.css";

class Maze extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <p>Maze Generator</p>
        <Row />
      </div>
    );
  }
}

export default Maze;
