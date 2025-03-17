"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultizeAxis = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _constants = require("../../constants");
const defaultizeAxis = (inAxis, axisName) => {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? _constants.DEFAULT_X_AXIS_KEY : _constants.DEFAULT_Y_AXIS_KEY;
  return [...(inAxis?.map((axis, index) => (0, _extends2.default)({
    id: `defaultized-${axisName}-axis-${index}`
  }, axis)) ?? []), ...(inAxis === undefined || inAxis.findIndex(({
    id
  }) => id === DEFAULT_AXIS_KEY) === -1 ? [{
    id: DEFAULT_AXIS_KEY,
    scaleType: 'linear'
  }] : [])];
};
exports.defaultizeAxis = defaultizeAxis;