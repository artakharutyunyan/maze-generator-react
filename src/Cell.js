import React, { Component } from "react";
import PropTypes from "prop-types";

class Cell extends Component {
  constructor() {
    super();
  }

  getWallsToShow(walls) {
    return Object.keys(walls).reduce((acc, currentWall) => {
      return `${acc} ${walls[currentWall] ? `border-${currentWall}` : ""}`;
    }, "cell ");
  }

  render() {
    const { walls } = this.props;
    return <div className={this.getWallsToShow(walls)}></div>;
  }
}

Cell.propTypes = {
  walls: PropTypes.exact({
    left: PropTypes.bool,
    right: PropTypes.bool,
    top: PropTypes.bool,
    bottom: PropTypes.bool,
  }),
};

export default Cell;
