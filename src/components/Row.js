import React, { Component } from "react";
import PropTypes from "prop-types";

import Cell from "./Cell.js";

class Row extends Component {
  constructor(props) {
    super(props);
    this.currentCell = 0;
    this.timesTicked = 0;
    this.initialWalls = {
      left: true,
      right: true,
      top: false,
      bottom: true,
    };
    this.state = {
      cells: [],
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), this.props.speed);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  generateNewSetId() {
    const index =
      this.props.index * Math.pow(10, this.props.width.toString().length);
    const id = index + this.currentCell;
    return id;
  }

  createRow() {
    let newCell;
    let setID;
    const { previousRowCells } = this.props;
    let walls = {
      ...this.initialWalls,
      top: previousRowCells ? false : true,
    };

    if (
      previousRowCells &&
      !previousRowCells[this.currentCell].props.walls.bottom
    ) {
      setID = previousRowCells[this.currentCell].props.setID;
    } else {
      setID = this.generateNewSetId();
    }

    if (this.willJoinVertical() && !this.props.lastRow) {
      walls = {
        ...walls,
        bottom: false,
      };
    }

    newCell = <Cell setID={setID} walls={walls} key={this.currentCell} />;

    this.setState({
      cells: [...this.state.cells, newCell],
    });
    this.currentCell += 1;
  }

  willJoinVertical() {
    return 1 - this.props.chanceToJoin > Math.random();
  }

  willJoin() {
    return this.props.chanceToJoin > Math.random();
  }

  getCellsAndHighlightCurrent() {
    return this.state.cells.map((cell, i) => {
      if (i !== this.currentCell) {
        return <Cell {...cell.props} key={i} active={false} />;
      }
      return <Cell {...cell.props} key={i} active={true} />;
    });
  }

  joinCellsToSet(cells, currentCellSetId, nextCellSetId) {
    cells[this.currentCell].props.walls.right = false;
    cells[this.currentCell + 1].props.walls.left = false;

    return cells.map((cell, i) => {
      if (cell.props.setID !== nextCellSetId) {
        return cell;
      }

      return <Cell {...cell.props} key={i} setID={currentCellSetId} />;
    });
  }

  joinSomeCells() {
    if (this.currentCell > this.props.width) {
      clearInterval(this.timerID);
      const cells = this.state.cells.map((cell, i) => {
        return <Cell {...cell.props} key={i} active={false} />;
      });
      this.setState({ cells });
      this.props.sendRowState(this.state.cells, this.props.index);
      return;
    }
    if (this.currentCell > this.props.width - 1) {
      this.ensureVerticalConnections();
      return;
    }

    let cells = this.getCellsAndHighlightCurrent();
    const currentCellSetId = cells[this.currentCell].props.setID;

    if (
      !this.props.lastRow &&
      this.willJoin() &&
      this.currentCell < this.props.width - 1 &&
      currentCellSetId !== cells[this.currentCell + 1].props.setID
    ) {
      cells = this.joinCellsToSet(
        cells,
        currentCellSetId,
        cells[this.currentCell + 1].props.setID
      );
    }

    if (this.props.lastRow) {
      if (
        cells[this.currentCell + 1] &&
        cells[this.currentCell + 1].props.setID !==
          cells[this.currentCell].props.setID
      ) {
        cells = this.joinCellsToSet(
          cells,
          currentCellSetId,
          cells[this.currentCell + 1].props.setID
        );
      }
    }

    this.setState({ cells });
  }

  ensureVerticalConnections() {
    if (this.props.lastRow) {
      return;
    }

    const setMap = {};
    this.state.cells.forEach((cell, i) => {
      const setID = cell.props.setID;
      if (!setMap[setID]) {
        setMap[setID] = [];
      }
      setMap[setID].push(i);
    });

    const cellsToAddVerticalConnection = Object.keys(setMap).map((key) => {
      let hasAVerticalConnection = false;
      setMap[key].forEach((cellIndex) => {
        if (!this.state.cells[cellIndex].props.walls.bottom) {
          hasAVerticalConnection = true;
        }
      });

      if (hasAVerticalConnection) return null;
      const randomCell =
        setMap[key][Math.floor(Math.random() * setMap[key].length)];
      return randomCell;
    });

    const cells = this.state.cells.map((cell, i) => {
      if (!cellsToAddVerticalConnection.includes(i)) {
        return cell;
      }

      const walls = {
        ...cell.props.walls,
        bottom: false,
      };

      return (
        <Cell
          {...cell.props}
          key={i}
          active={i === this.props.width - 1 ? true : false}
          walls={walls}
        />
      );
    });

    this.setState({ cells });
  }

  tick() {
    this.timesTicked++;

    if (this.state.cells.length === this.props.width) {
      this.currentCell = this.timesTicked - this.props.width - 1;
      this.joinSomeCells();
      return;
    }

    this.createRow();
  }

  render() {
    return <div>{this.state.cells}</div>;
  }
}

Row.propTypes = {
  width: PropTypes.number,
  index: PropTypes.number,
  chanceToJoin: PropTypes.number,
  speed: PropTypes.number,
  sendRowState: PropTypes.func,
};

export default Row;
