"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarProvider = PolarProvider;
var React = _interopRequireWildcard(require("react"));
var _computeAxisValue = require("../../internals/computeAxisValue");
var _useDrawingArea = require("../../hooks/useDrawingArea");
var _useSeries = require("../../hooks/useSeries");
var _PolarContext = require("./PolarContext");
var _useRadiusExtremumGetter = require("../PluginProvider/useRadiusExtremumGetter");
var _useRotationExtremumGetter = require("../PluginProvider/useRotationExtremumGetter");
var _jsxRuntime = require("react/jsx-runtime");
function PolarProvider(props) {
  const {
    rotationAxis,
    radiusAxis,
    children
  } = props;
  const formattedSeries = (0, _useSeries.useSeries)();
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const rotationExtremumGetters = (0, _useRotationExtremumGetter.useRotationExtremumGetter)();
  const radiusExtremumGetters = (0, _useRadiusExtremumGetter.useRadiusExtremumGetter)();
  const rotationValues = React.useMemo(() => (0, _computeAxisValue.computeAxisValue)({
    drawingArea,
    formattedSeries,
    axis: rotationAxis,
    extremumGetters: rotationExtremumGetters,
    axisDirection: 'rotation'
  }), [drawingArea, formattedSeries, rotationAxis, rotationExtremumGetters]);
  const radiusValues = React.useMemo(() => (0, _computeAxisValue.computeAxisValue)({
    drawingArea,
    formattedSeries,
    axis: radiusAxis,
    extremumGetters: radiusExtremumGetters,
    axisDirection: 'radius'
  }), [drawingArea, formattedSeries, radiusAxis, radiusExtremumGetters]);
  const value = React.useMemo(() => ({
    isInitialized: true,
    data: {
      rotationAxis: rotationValues.axis,
      radiusAxis: radiusValues.axis,
      rotationAxisIds: rotationValues.axisIds,
      radiusAxisIds: radiusValues.axisIds
    }
  }), [rotationValues, radiusValues]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_PolarContext.PolarContext.Provider, {
    value: value,
    children: children
  });
}