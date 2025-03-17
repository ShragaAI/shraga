"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianProvider = CartesianProvider;
var React = _interopRequireWildcard(require("react"));
var _computeAxisValue = require("../../internals/computeAxisValue");
var _useDrawingArea = require("../../hooks/useDrawingArea");
var _useSeries = require("../../hooks/useSeries");
var _CartesianContext = require("./CartesianContext");
var _useXExtremumGetter = require("../PluginProvider/useXExtremumGetter");
var _PluginProvider = require("../PluginProvider");
var _jsxRuntime = require("react/jsx-runtime");
function CartesianProvider(props) {
  const {
    xAxis,
    yAxis,
    children
  } = props;
  const formattedSeries = (0, _useSeries.useSeries)();
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const xExtremumGetters = (0, _useXExtremumGetter.useXExtremumGetter)();
  const yExtremumGetters = (0, _PluginProvider.useYExtremumGetter)();
  const xValues = React.useMemo(() => (0, _computeAxisValue.computeAxisValue)({
    drawingArea,
    formattedSeries,
    axis: xAxis,
    extremumGetters: xExtremumGetters,
    axisDirection: 'x'
  }), [drawingArea, formattedSeries, xAxis, xExtremumGetters]);
  const yValues = React.useMemo(() => (0, _computeAxisValue.computeAxisValue)({
    drawingArea,
    formattedSeries,
    axis: yAxis,
    extremumGetters: yExtremumGetters,
    axisDirection: 'y'
  }), [drawingArea, formattedSeries, yAxis, yExtremumGetters]);
  const value = React.useMemo(() => ({
    isInitialized: true,
    data: {
      xAxis: xValues.axis,
      yAxis: yValues.axis,
      xAxisIds: xValues.axisIds,
      yAxisIds: yValues.axisIds
    }
  }), [xValues, yValues]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_CartesianContext.CartesianContext.Provider, {
    value: value,
    children: children
  });
}