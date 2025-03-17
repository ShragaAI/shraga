"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsGridVertical = ChartsGridVertical;
var React = _interopRequireWildcard(require("react"));
var _useTicks = require("../hooks/useTicks");
var _styledCommonents = require("./styledCommonents");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function ChartsGridVertical(props) {
  const {
    axis,
    drawingArea,
    classes
  } = props;
  const {
    scale,
    tickNumber,
    tickInterval
  } = axis;
  const xTicks = (0, _useTicks.useTicks)({
    scale,
    tickNumber,
    tickInterval
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
    children: xTicks.map(({
      value,
      offset
    }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledCommonents.GridLine, {
      y1: drawingArea.top,
      y2: drawingArea.top + drawingArea.height,
      x1: offset,
      x2: offset,
      className: classes.verticalLine
    }, `vertical-${value}`))
  });
}