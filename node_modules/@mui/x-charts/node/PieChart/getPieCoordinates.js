"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPieCoordinates = getPieCoordinates;
var _getPercentageValue = require("../internals/getPercentageValue");
function getPieCoordinates(series, drawing) {
  const {
    height,
    width
  } = drawing;
  const {
    cx: cxParam,
    cy: cyParam
  } = series;
  const availableRadius = Math.min(width, height) / 2;
  const cx = (0, _getPercentageValue.getPercentageValue)(cxParam ?? '50%', width);
  const cy = (0, _getPercentageValue.getPercentageValue)(cyParam ?? '50%', height);
  return {
    cx,
    cy,
    availableRadius
  };
}