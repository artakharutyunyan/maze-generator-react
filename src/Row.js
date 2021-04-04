import React, { Component } from "react";
import PropTypes from "prop-types";

import Cell from "./Cell.js";

class Row extends Component {
  constructor(props) {
    super(props);
    // the index of the cell inside the row
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

    // if the above cell is connected, use its setID
    if (
      previousRowCells &&
      !previousRowCells[this.currentCell].props.walls.bottom
    ) {
      setID = previousRowCells[this.currentCell].props.setID;
    } else {
      setID = this.generateNewSetId();
    }

    // // check if there will be a
    // // random vertical connection
    if (this.willJoin("vertical") && !this.props.lastRow) {
      walls = {
        ...walls,
        bottom: false,
      };
    }

    newCell = <Cell setID={setID} walls={walls} />;

    this.setState({
      cells: [...this.state.cells, newCell],
    });
    this.currentCell += 1;
  }

  willJoin() {
    return this.props.chanceToJoin > Math.random();
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

  joinCellsToSet(cells, currentCellSetId, nextCellSetId) {
    // drop walls between current and next cell
    cells[this.currentCell].props.walls.right = false;
    cells[this.currentCell + 1].props.walls.left = false;

    // assign the current set id all cells having the same previous set ID
    return cells.map((cell, i) => {
      if (cell.props.setID !== nextCellSetId) {
        return cell;
      }

      return (
        <Cell
          setID={currentCellSetId}
          active={cell.props.active}
          walls={cell.props.walls}
        />
      );
    });
  }

  joinSomeCells() {
    // after ensuring vertical connections
    if (this.currentCell > this.props.width) {
      clearInterval(this.timerID);
      // remove the active style
      const cells = this.state.cells.map((cell, i) => {
        return (
          <Cell
            setID={cell.props.setID}
            active={false}
            walls={cell.props.walls}
          />
        );
      });
      this.setState({ cells });
      // tell the Maze that the row is done, so we can pass
      // the state of the row to the next Row
      this.props.sendRowState(this.state.cells, this.props.index);
      return;
    }
    // after the rows have been joined
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

    // if last set,
    // - give bottom walls
    // - knock down walls between cells that are from different sets
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

  // after the row has been created, ensure that atleast
  // one vertical connection exists per set
  // if not, randomly assign one
  ensureVerticalConnections() {
    if (this.props.lastRow) {
      return;
    }

    // with form {[setID]: cellsBelongingToSet[]}
    const setMap = {};
    this.state.cells.forEach((cell, i) => {
      const setID = cell.props.setID;
      if (!setMap[setID]) {
        setMap[setID] = [];
      }
      setMap[setID].push(i);
    });

    // O(n) since it traverses all cells only once
    const cellsToAddVerticalConnection = Object.keys(setMap).map((key) => {
      let hasAVerticalConnection = false;
      setMap[key].forEach((cellIndex) => {
        if (!this.state.cells[cellIndex].props.walls.bottom) {
          hasAVerticalConnection = true;
        }
      });

      if (hasAVerticalConnection) return null;
      // randomly choose a vertical connection
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
          setID={cell.props.setID}
          active={i === this.props.width - 1 ? true : false}
          walls={walls}
        />
      );
    });

    // set state
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
