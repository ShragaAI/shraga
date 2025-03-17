"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useXAxis = useXAxis;
exports.useYAxis = useYAxis;
var _CartesianProvider = require("../context/CartesianProvider");
function useXAxis(identifier) {
  const {
    xAxis,
    xAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];
  return xAxis[id];
}
function useYAxis(identifier) {
  const {
    yAxis,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];
  return yAxis[id];
}