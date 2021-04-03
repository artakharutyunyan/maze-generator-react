import React, { Component } from "react";

import Cell from "./Cell.js";

class Row extends Component {
  constructor() {
    super();
    this.currentCell = 0;
    this.timesTicked = 0;
    this.speed = 500;
    this.chanceToJoin = 0.3;
    this.width = 10;
    this.height = 10;
    this.initialWalls = {
      left: true,
      right: true,
      top: true,
      bottom: true,
    };
    this.state = {
      cells: [],
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), this.speed);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  createRow() {
    this.setState({
      cells: [
        ...this.state.cells,
        <Cell setID={this.currentCell} walls={this.initialWalls} />,
      ],
    });
    this.currentCell += 1;
  }

  willJoin() {
    return Math.random() > this.chanceToJoin;
  }

  getCellsAndHighlightCurrent() {
    return this.state.cells.map((cell, i) => {
      if (i !== this.currentCell) {
        return (
          <Cell
            setID={cell.props.setID}
            active={false}
            walls={cell.props.walls}
          />
        );
      }
      return (
        <Cell setID={cell.props.setID} active={true} walls={cell.props.walls} />
      );
    });
  }

  joinCellToSet(cells, currentCellSetId) {
    const walls = {
      ...cells[this.currentCell].props.walls,
      right: false,
    };
    return <Cell setID={currentCellSetId} active={true} walls={walls} />;
  }

  joinCellToLastSet(cells) {
    const walls = {
      ...cells[this.currentCell].props.walls,
      left: false,
    };
    return (
      <Cell
        setID={cells[this.currentCell - 1].props.setID}
        active={true}
        walls={walls}
      />
    );
  }

  joinSomeCells() {
    if (this.currentCell > this.width - 1) {
      clearInterval(this.timerID);
      return;
    }

    const cells = this.getCellsAndHighlightCurrent();
    const currentCellSetId = cells[this.currentCell].props.setID;

    if (this.willJoin()) {
      cells[this.currentCell] = this.joinCellToSet(cells, currentCellSetId);
    }

    if (
      cells[this.currentCell - 1] &&
      !cells[this.currentCell - 1].props.walls.right
    ) {
      cells[this.currentCell] = this.joinCellToLastSet(cells);
    }

    this.setState({ cells });
  }

  tick() {
    this.timesTicked++;

    if (this.state.cells.length >= this.width) {
      this.currentCell = this.timesTicked - this.width - 1;
      this.joinSomeCells();
      return;
    }
    this.createRow();
  }

  render() {
    return <div>{this.state.cells}</div>;
  }
}

export default Row;
