import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Cell from './Cell.js'

class Row extends Component {
  constructor(props) {
    super(props);
    // the index of the cell inside the row
    this.currentCell = 0;
    this.timesTicked = 0;
    this.speed = 100;
    this.chanceToJoin = {
      // the less chance, the more vertical walls
      horizontal: 0.8, // x100 for %
      // the less chance, the more horizontal walls
      vertical: 0.33
    }
    this.initialWalls = {
      left: true,
      right: true,
      top: false,
      bottom: true,
    }
    this.state = {
      cells: [],
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      this.speed
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  generateNewSetId() {
    const index = this.props.index * 10;
    const id = index + this.currentCell;
    return id;
  }

  createRow() {
    let newCell;
    const {previousRowCells} = this.props;
    let walls = {
      ...this.initialWalls,
      top: previousRowCells ? false : true,
    }

    // check if there will be a 
    // random vertical connection
    if (this.willJoin('vertical') && !this.props.lastRow) {
      walls = {
        ...walls,
        bottom: false
      }

      const setID = previousRowCells ? 
        previousRowCells[this.currentCell].props.setID : 
        this.generateNewSetId();

      newCell = <Cell setID={setID}
                      walls={walls}/>;
    } else {
      // adding the row index as a multiple of 10 to the currentCell
      // we make sure that the setID hasn't been used before
      newCell = <Cell setID={this.generateNewSetId()}
                      walls={walls}/>;
    }

    this.setState({
      cells: [
        ...this.state.cells, 
        newCell
      ]
    });
    this.currentCell += 1;
  }


  willJoin(direction) {
    return Math.random() < this.chanceToJoin[direction];
  }

  getCellsAndHighlightCurrent() {
    return this.state.cells.map((cell, i) => {
      if (i !== this.currentCell) {
        return <Cell setID={cell.props.setID}
                     active={false}
                     walls={cell.props.walls}/>
      }
      return <Cell setID={cell.props.setID}
                     active={true}
                     walls={cell.props.walls}/>
    });
  }

  joinCellToSet(cells, currentCellSetId) {
    const walls = {
      ...cells[this.currentCell].props.walls,
      right: false,
    }
    return (
      <Cell setID={currentCellSetId}
            active={true}
            walls={walls}/>
    );
  }

  joinCellToLastSet(cells) {
    const walls = {
      ...cells[this.currentCell].props.walls,
      left: false,
    }
    return (
      <Cell setID={cells[this.currentCell - 1].props.setID}
            active={true}
            walls={walls}/>
    );
  }

  joinSomeCells() {
    // after ensuring vertical connections
    if (this.currentCell > this.props.width) {
      clearInterval(this.timerID);
      // remove the active style
      const cells = this.state.cells.map((cell, i) => {
  
        return <Cell setID={cell.props.setID}
                     active={false}
                     walls={cell.props.walls}/>
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

    if (this.willJoin('horizontal') && this.currentCell < this.props.width - 1) {
      cells[this.currentCell] = this.joinCellToSet(cells, currentCellSetId);
    }

    // if the current cell must be joined to the previous cell
    // whether it will join or not was decided on the previous tick
    // we just do the join in this tick so that it visually looks like
    if (cells[this.currentCell - 1] && !cells[this.currentCell - 1].props.walls.right) {
      cells[this.currentCell] = this.joinCellToLastSet(cells);
    }

    // if last set, 
    // - give bottom walls
    // - knock down walls between cells that are from different sets
    if (this.props.lastRow) {
      if (cells[this.currentCell + 1] && 
          cells[this.currentCell + 1].props.setID !== 
          cells[this.currentCell].props.setID) {
        cells[this.currentCell] = this.joinCellToSet(cells, currentCellSetId);
      }

      cells[this.currentCell] = 
        <Cell setID={cells[this.currentCell].props.setID}
              active={true}
              walls={cells[this.currentCell].props.walls}/>;
    }

    this.setState({ cells });
  }

  // after the row has been created, ensure that atleast
  // one vertical connection exists per set
  // if not, randomly assign one
  ensureVerticalConnections() {
    if (!this.props.previousRowCells || this.props.lastRow) {
      return;
    }
    
    // with form {[setID]: cellsBelongingToSet[]}
    const setMap = {};
    this.state.cells.forEach((cell,i) => {
      const setID = cell.props.setID;
      if (!setMap[setID]) {
        setMap[setID] = [];
      }
      setMap[setID].push(i);
    });

    const cellsToAddVerticalConnection = Object.keys(setMap).map(key => {
      let hasAVerticalConnection = false;
      setMap[key].forEach(cellIndex => {
        if (!this.state.cells[cellIndex].props.walls.bottom) {
          hasAVerticalConnection = true;
        }
      });

      if (hasAVerticalConnection) return null;
      // randomly choose a vertical connection
      const randomCell = setMap[key][Math.floor(Math.random() * setMap[key].length)];
      return randomCell;
    });

    const cells = this.state.cells.map((cell, i) => {
      if (!cellsToAddVerticalConnection.includes(i)) {
        return cell;
      }

      const walls = {
        ...cell.props.walls,
        bottom: false,
      }

      return <Cell setID={cell.props.setID}
                   active={i === this.props.width - 1 ? true : false}
                   walls={walls}/>
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
    return <div>{this.state.cells}</div>
  }
}

Row.propTypes = {
  width: PropTypes.number,
  index: PropTypes.number,
  sendRowState: PropTypes.func
};

export default Row