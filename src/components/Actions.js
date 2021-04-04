import React, { Component } from "react";
import PropTypes from "prop-types";

class Actions extends Component {
  render() {
    const {
      rows,
      width,
      height,
      chanceToJoin,
      speed,
      resetMaze,
      setDimension,
      setChance,
      setSpeed,
    } = this.props;

    return (
      <form className="actions">
        <div className="main-menu">
          <button
            className={`btn ${rows.length ? "btn-danger" : "btn-info"}`}
            onClick={resetMaze}
          >
            {rows.length ? "Clear Maze" : "Generate Maze"}
          </button>
        </div>

        {rows.length ? null : (
          <div>
            <div className="row">
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="form-group">
                  <label htmlFor="widthInput">Width:</label>

                  <input
                    id="widthInput"
                    type="number"
                    required
                    className="form-control"
                    placeholder="maze width in cell units"
                    value={width}
                    onChange={(e) => setDimension("width", e)}
                  />

                  <small className="form-text text-muted">
                    The number of horizontal cells
                  </small>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="form-group">
                  <label htmlFor="heightInput">Height:</label>

                  <input
                    id="heightInput"
                    type="number"
                    required
                    className="form-control"
                    value={height}
                    placeholder="maze height in cell units"
                    onChange={(e) => setDimension("height", e)}
                  />

                  <small className="form-text text-muted">
                    The number of vertical cells
                  </small>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="form-group">
                  <label htmlFor="mergeChanceInput">
                    Merge chance (min 0 max 1):
                  </label>

                  <input
                    id="mergeChanceInput"
                    type="number"
                    required
                    className="form-control"
                    value={chanceToJoin}
                    placeholder="% chance to have a wall"
                    onChange={(e) => setChance(e)}
                  />

                  <small className="form-text text-muted">
                    Chance to join cells horizontally. A high chance tends to
                    create horizontal mazes while a low chance creates more
                    vertical ones.
                  </small>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
                <div className="form-group">
                  <label htmlFor="mergeChanceInput">
                    Maze generation speed (ms):
                  </label>

                  <input
                    id="speedInput"
                    type="number"
                    required
                    className="form-control"
                    value={speed}
                    placeholder="speed in ms"
                    onChange={(e) => setSpeed(e)}
                  />

                  <small className="form-text text-muted">
                    How fast you want the maze to generate. Units in
                    milliseconds.
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    );
  }
}

Actions.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  speed: PropTypes.number,
  startMaze: PropTypes.func,
  resetMaze: PropTypes.func,
  setDimension: PropTypes.func,
  setChance: PropTypes.func,
  setSpeed: PropTypes.func,
};

export default Actions;
