import React, { Component } from "react";

import Cell from "./Cell.js";
import "./style.css";

class App extends Component {
  constructor() {
    super();
    this.currentSetID = 1;
    this.timesTicked = 0;
    this.speed = 2000;
    this.chanceToJoin = 0.3;
    this.initialWalls = {
      left: true,
      right: true,
      top: true,
      bottom: true,
    };
    this.state = {
      width: 10,
      height: 10,
      cells: [],
    };
  }

  componentDidMount() {
    // this.timerID = setInterval(
    //   () => this.tick(),
    //   this.speed
    // );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  createRow() {
    this.setState({
      cells: [
        ...this.state.cells,
        <Cell setID={this.currentSetID} walls={this.initialWalls} />,
      ],
    });
    this.currentSetID += 1;
  }

  joinSomeCells() {
    if (this.state.cells.length >= this.state.width) {
      clearInterval(this.timerID);
      return;
    }
    // this.setState
  }

  tick() {
    this.timesTicked++;
    console.log(this.timesTicked);
    if (this.state.cells.length >= this.state.width) {
      this.currentSetID = this.timesTicked - this.state.width;
      this.joinSomeCells();
      return;
    }
    this.createRow();
  }

  render() {
    return (
      <div>
        <p>Maze Generator</p>
        {this.state.cells}
      </div>
    );
  }
}

export default App;
