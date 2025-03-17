"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValueToPositionMapper = getValueToPositionMapper;
exports.useXScale = useXScale;
exports.useYScale = useYScale;
var _isBandScale = require("../internals/isBandScale");
var _useAxis = require("./useAxis");
/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
function getValueToPositionMapper(scale) {
  if ((0, _isBandScale.isBandScale)(scale)) {
    return value => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }
  return value => scale(value);
}
function useXScale(identifier) {
  const axis = (0, _useAxis.useXAxis)(identifier);
  return axis.scale;
}
function useYScale(identifier) {
  const axis = (0, _useAxis.useYAxis)(identifier);
  return axis.scale;
}