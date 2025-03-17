"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useXColorScale = useXColorScale;
exports.useYColorScale = useYColorScale;
exports.useZColorScale = useZColorScale;
var React = _interopRequireWildcard(require("react"));
var _CartesianProvider = require("../context/CartesianProvider");
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
function useXColorScale(identifier) {
  const {
    xAxis,
    xAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];
  return xAxis[id].colorScale;
}
function useYColorScale(identifier) {
  const {
    yAxis,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];
  return yAxis[id].colorScale;
}
function useZColorScale(identifier) {
  const {
    zAxis,
    zAxisIds
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
  const id = typeof identifier === 'string' ? identifier : zAxisIds[identifier ?? 0];
  return zAxis[id]?.colorScale;
}