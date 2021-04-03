import React, { Component } from "react";
import PropTypes from "prop-types";

class Cell extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * extract the walls object into a string with from 'cell border-left ...' according to what borders need to be shown
   */
  getWallsToShow(walls) {
    return Object.keys(walls).reduce((acc, currentWall) => {
      return `${acc} ${walls[currentWall] ? `border-${currentWall}` : ""}`;
    }, "cell ");
  }

  render() {
    const { walls } = this.props;
    return <div className={this.getWallsToShow(walls)}>{this.props.setID}</div>;
  }
}

Cell.propTypes = {
  setID: PropTypes.number,
  walls: PropTypes.exact({
    left: PropTypes.bool,
    right: PropTypes.bool,
    top: PropTypes.bool,
    bottom: PropTypes.bool,
  }),
};

export default Cell;
