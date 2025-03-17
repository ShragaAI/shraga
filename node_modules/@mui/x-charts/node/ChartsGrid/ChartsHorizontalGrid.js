"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsGridHorizontal = ChartsGridHorizontal;
var React = _interopRequireWildcard(require("react"));
var _useTicks = require("../hooks/useTicks");
var _styledCommonents = require("./styledCommonents");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function ChartsGridHorizontal(props) {
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
  const yTicks = (0, _useTicks.useTicks)({
    scale,
    tickNumber,
    tickInterval
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
    children: yTicks.map(({
      value,
      offset
    }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_styledCommonents.GridLine, {
      y1: offset,
      y2: offset,
      x1: drawingArea.left,
      x2: drawingArea.left + drawingArea.width,
      className: classes.horizontalLine
    }, `horizontal-${value}`))
  });
}