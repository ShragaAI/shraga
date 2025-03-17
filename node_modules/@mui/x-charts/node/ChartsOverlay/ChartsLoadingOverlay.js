"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLoadingOverlay = ChartsLoadingOverlay;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["message"];
const StyledText = (0, _styles.styled)('text')(({
  theme
}) => (0, _extends2.default)({}, theme.typography.body2, {
  stroke: 'none',
  fill: theme.palette.text.primary,
  shapeRendering: 'crispEdges',
  textAnchor: 'middle',
  dominantBaseline: 'middle'
}));
function ChartsLoadingOverlay(props) {
  const {
      message
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    top,
    left,
    height,
    width
  } = (0, _useDrawingArea.useDrawingArea)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledText, (0, _extends2.default)({
    x: left + width / 2,
    y: top + height / 2
  }, other, {
    children: message ?? 'Loading data…'
  }));
}