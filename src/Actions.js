import React, { Component } from "react";
import PropTypes from "prop-types";

class Actions extends Component {
  render() {
    const { rows, width, height, resetMaze, setDimension } = this.props;

    return (
      <div className="actions">
        <button className="button" onClick={resetMaze}>
          {rows.length ? "Clear Maze" : "Generate Maze"}
        </button>

        {rows.length ? null : (
          <div>
            <div>
              <label htmlFor="widthInput">Width: </label>
              <input
                id="widthInput"
                type="text"
                className="input"
                placeholder="maze width in cell units"
                value={width}
                onChange={(e) => setDimension("width", e)}
              />
            </div>

            <div>
              <label htmlFor="heightInput">Height: </label>
              <input
                id="heightInput"
                type="text"
                className="input"
                value={height}
                placeholder="maze height in cell units"
                onChange={(e) => setDimension("height", e)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

Actions.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  startMaze: PropTypes.func,
  resetMaze: PropTypes.func,
  setDimension: PropTypes.func,
};

export default Actions;
