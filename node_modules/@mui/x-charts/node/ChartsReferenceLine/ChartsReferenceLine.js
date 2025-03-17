"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsReferenceLine = ChartsReferenceLine;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ChartsXReferenceLine = require("./ChartsXReferenceLine");
var _ChartsYReferenceLine = require("./ChartsYReferenceLine");
var _jsxRuntime = require("react/jsx-runtime");
function ChartsReferenceLine(props) {
  const {
    x,
    y
  } = props;
  if (x !== undefined && y !== undefined) {
    throw new Error('MUI X: The ChartsReferenceLine cannot have both `x` and `y` props set.');
  }
  if (x === undefined && y === undefined) {
    throw new Error('MUI X: The ChartsReferenceLine should have a value in `x` or `y` prop.');
  }
  if (x !== undefined) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsXReferenceLine.ChartsXReferenceLine, (0, _extends2.default)({}, props));
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsYReferenceLine.ChartsYReferenceLine, (0, _extends2.default)({}, props));
}
process.env.NODE_ENV !== "production" ? ChartsReferenceLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis used for the reference value.
   * @default The `id` of the first defined axis.
   */
  axisId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * The label to display along the reference line.
   */
  label: _propTypes.default.string,
  /**
   * The alignment if the label is in the chart drawing area.
   * @default 'middle'
   */
  labelAlign: _propTypes.default.oneOf(['end', 'middle', 'start']),
  /**
   * The style applied to the label.
   */
  labelStyle: _propTypes.default.object,
  /**
   * The style applied to the line.
   */
  lineStyle: _propTypes.default.object,
  /**
   * Additional space around the label in px.
   * Can be a number or an object `{ x, y }` to distinguish space with the reference line and space with axes.
   * @default 5
   */
  spacing: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  })]),
  /**
   * The x value associated with the reference line.
   * If defined the reference line will be vertical.
   */
  x: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]),
  /**
   * The y value associated with the reference line.
   * If defined the reference line will be horizontal.
   */
  y: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string])
} : void 0;