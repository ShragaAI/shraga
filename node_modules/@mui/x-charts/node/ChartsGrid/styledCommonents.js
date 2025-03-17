"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridRoot = exports.GridLine = void 0;
var _styles = require("@mui/material/styles");
var _chartsGridClasses = require("./chartsGridClasses");
const GridRoot = exports.GridRoot = (0, _styles.styled)('g', {
  name: 'MuiChartsGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [{
    [`&.${_chartsGridClasses.chartsGridClasses.verticalLine}`]: styles.verticalLine
  }, {
    [`&.${_chartsGridClasses.chartsGridClasses.horizontalLine}`]: styles.horizontalLine
  }, styles.root]
})({});
const GridLine = exports.GridLine = (0, _styles.styled)('line', {
  name: 'MuiChartsGrid',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.line
})(({
  theme
}) => ({
  stroke: (theme.vars || theme).palette.divider,
  shapeRendering: 'crispEdges',
  strokeWidth: 1
}));