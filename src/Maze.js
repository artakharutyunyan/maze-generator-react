import React, { Component } from "react";

import Row from "./Row.js";
import "./style.css";

class Maze extends Component {
  constructor() {
    super();
    this.height = 10;
    this.width = 10;
    this.state = {
      rows: [],
    };

    this.resetMaze = this.resetMaze.bind(this);
  }

  startMaze() {
    this.setState({
      rows: [
        <Row
          index={0}
          width={this.width}
          cells={false}
          previousRowCells={false}
          sendRowState={this.receiveCompleteRow.bind(this)}
        />,
      ],
    });
  }

  componentDidMount() {
    this.startMaze();
  }

  receiveCompleteRow(cells, index) {
    if (index === this.height - 1) {
      return;
    }

    if (index === this.height - 2) {
      this.setState({
        rows: [
          ...this.state.rows,
          <Row
            index={index + 1}
            width={this.width}
            previousRowCells={cells}
            lastRow={true}
            sendRowState={this.receiveCompleteRow.bind(this)}
          />,
        ],
      });
      return;
    }

    this.setState({
      rows: [
        // react saves the state for the previous rows so we just need
        // to spread them here again
        ...this.state.rows,
        // the new row
        <Row
          index={index + 1}
          width={this.width}
          previousRowCells={cells}
          sendRowState={this.receiveCompleteRow.bind(this)}
        />,
      ],
    });
  }

  resetMaze() {
    console.log("yaaauuuu");
  }

  render() {
    return (
      <div>
        <p>Maze Generator</p>

        <div>
          <button className="reset-cta" onClick={this.resetMaze}>
            Clear Maze
          </button>
        </div>

        {this.state.rows}
      </div>
    );
  }
}

export default Maze;
