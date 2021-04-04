import React, { Component } from "react";

import Row from "./Row.js";
import Actions from "./Actions.js";
import "./style.css";

class Maze extends Component {
  constructor() {
    super();
    this.state = {
      height: 10,
      width: 10,
      rows: [],
      completed: false,
    };

    this.resetMaze = this.resetMaze.bind(this);
    this.setDimension = this.setDimension.bind(this);
  }

  startMaze() {
    this.setState({
      rows: [
        <Row
          index={0}
          width={this.state.width}
          cells={false}
          previousRowCells={false}
          sendRowState={this.receiveCompleteRow.bind(this)}
        />,
      ],
    });
  }

  receiveCompleteRow(cells, index) {
    // Done with the maze
    if (index === this.state.height - 1) {
      this.setState({ completed: true });
      return;
    }

    // last row
    if (index === this.state.height - 2) {
      this.setState({
        rows: [
          ...this.state.rows,
          <Row
            index={index + 1}
            width={this.state.width}
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
          width={this.state.width}
          previousRowCells={cells}
          sendRowState={this.receiveCompleteRow.bind(this)}
        />,
      ],
    });
  }

  setDimension(dimension, event) {
    if (dimension === "width") {
      this.setState({ width: Number(event.target.value) });
      return;
    }
    this.setState({ height: Number(event.target.value) });
  }

  resetMaze() {
    if (!this.state.rows.length) {
      this.startMaze();
      return;
    }
    this.setState({ rows: [], completed: false });
  }

  render() {
    const { rows, completed } = this.state;

    return (
      <div>
        <h3>Maze Generator</h3>

        <Actions
          width={this.state.width}
          height={this.state.height}
          rows={this.state.rows}
          startMaze={this.startMaze}
          resetMaze={this.resetMaze}
          setDimension={this.setDimension}
        />

        <div className={`maze ${completed ? "completed" : ""}`}>{rows}</div>
      </div>
    );
  }
}
export default Maze;
