import React, { Component } from "react";
import PropTypes from "prop-types";

class Cell extends Component {
  /**
   * extract the walls object into a string with from 'cell border-left ...'
   * according to what borders need to be shown
   */
  getWallsToShow() {
    const { walls } = this.props;
    return Object.keys(walls).reduce((acc, currentWall) => {
      return `${acc} ${walls[currentWall] ? `border-${currentWall}` : ""}`;
    }, "cell ");
  }

  getClasses() {
    const { active } = this.props;
    return `${this.getWallsToShow()} ${active ? "active" : ""}`;
  }

  render() {
    return <div className={this.getClasses()}>{this.props.setID}</div>;
  }
}

Cell.propTypes = {
  setID: PropTypes.number,
  active: PropTypes.bool,
  walls: PropTypes.exact({
    left: PropTypes.bool,
    right: PropTypes.bool,
    top: PropTypes.bool,
    bottom: PropTypes.bool,
  }),
};

export default Cell;
