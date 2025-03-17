"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GaugeValueArc = GaugeValueArc;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _styles = require("@mui/material/styles");
var _GaugeProvider = require("./GaugeProvider");
var _jsxRuntime = require("react/jsx-runtime");
const StyledPath = (0, _styles.styled)('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc',
  overridesResolver: (props, styles) => styles.referenceArc
})(({
  theme
}) => ({
  fill: (theme.vars || theme).palette.primary.main
}));
function GaugeValueArc(props) {
  const {
    value,
    valueMin,
    valueMax,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    cornerRadius,
    cx,
    cy
  } = (0, _GaugeProvider.useGaugeState)();
  if (value === null) {
    return null;
  }
  const valueAngle = startAngle + (value - valueMin) / (valueMax - valueMin) * (endAngle - startAngle);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledPath, (0, _extends2.default)({
    transform: `translate(${cx}, ${cy})`,
    d: (0, _d3Shape.arc)().cornerRadius(cornerRadius)({
      startAngle,
      endAngle: valueAngle,
      innerRadius,
      outerRadius
    })
  }, props));
}