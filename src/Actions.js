import React, { Component } from "react";
import PropTypes from "prop-types";

class Actions extends Component {
  render() {
    const {
      rows,
      width,
      height,
      chanceToJoin,
      resetMaze,
      setDimension,
      setChance,
    } = this.props;

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

            <div>
              <label
                htmlFor="mergeChanceInput"
                title="Chance to join cells horizontally. A high chance tends to create vertical mazes while a low chance creates more horizontal ones."
              >
                Merge chance
                <span class="chance-label-hint">(?): </span>
              </label>
              <input
                id="mergeChanceInput"
                type="text"
                className="input"
                value={chanceToJoin}
                placeholder="% chance to have a wall"
                onChange={(e) => setChance(e)}
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
  setChance: PropTypes.func,
};

export default Actions;
