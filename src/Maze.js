import React, { Component } from "react";

import Row from "./Row.js";
import Actions from "./Actions.js";
import "./style.scss";

class Maze extends Component {
  constructor() {
    super();
    this.state = {
      height: 10,
      width: 10,
      rows: [],
      completed: false,
      speed: 0,
      // the less chance, the more vertical walls
      chanceToJoin: 0.5,
      hasFormError: false,
    };

    this.resetMaze = this.resetMaze.bind(this);
    this.setDimension = this.setDimension.bind(this);
    this.setChance = this.setChance.bind(this);
    this.setSpeed = this.setSpeed.bind(this);
  }

  startMaze() {
    this.setState({
      rows: [
        <Row
          index={0}
          width={this.state.width}
          chanceToJoin={this.state.chanceToJoin}
          speed={this.state.speed}
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
            chanceToJoin={this.state.chanceToJoin}
            speed={this.state.speed}
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
          chanceToJoin={this.state.chanceToJoin}
          speed={this.state.speed}
          previousRowCells={cells}
          sendRowState={this.receiveCompleteRow.bind(this)}
        />,
      ],
    });
  }

  // we want empty strings to represent empty inputs
  // if we just leave Number(event.target.value), an empty input
  // will turn to 0 (not good UX)
  mapToStateValue(event) {
    const value = event.target.value;
    if (value === "") {
      return "";
    }
    return Number(value);
  }

  setDimension(dimension, event) {
    const value = this.mapToStateValue(event);
    if (dimension === "width") {
      this.setState({ width: value });
      return;
    }
    this.setState({ height: value });
  }

  setChance(event) {
    this.setState({ chanceToJoin: this.mapToStateValue(event.target.value) });
  }

  setSpeed(event) {
    this.setState({ speed: this.mapToStateValue(event.target.value) });
  }

  isFormValid() {
    const { width, height, chanceToJoin, speed } = this.state;

    return width && height && chanceToJoin >= 0 && chanceToJoin <= 1;
  }

  resetMaze(e) {
    e.preventDefault();
    if (this.state.rows.length) {
      this.setState({ rows: [], completed: false });
      return;
    }

    if (this.isFormValid()) {
      this.setState({ hasFormError: false });
      this.startMaze();
    } else {
      this.setState({ hasFormError: true });
    }
  }

  render() {
    const { rows, completed } = this.state;

    return (
      <div className="container pt-5">
        <h3 className="pb-3">Maze Generator</h3>

        <div className="error-text">
          {this.state.hasFormError
            ? "Please fill in the inputs correctly"
            : null}
        </div>

        <Actions
          width={this.state.width}
          height={this.state.height}
          rows={this.state.rows}
          chanceToJoin={this.state.chanceToJoin}
          speed={this.state.speed}
          startMaze={this.startMaze}
          resetMaze={this.resetMaze}
          setDimension={this.setDimension}
          setChance={this.setChance}
          setSpeed={this.setSpeed}
        />

        <div className={`maze ${completed ? "completed" : ""}`}>{rows}</div>
      </div>
    );
  }
}

export default Maze;
