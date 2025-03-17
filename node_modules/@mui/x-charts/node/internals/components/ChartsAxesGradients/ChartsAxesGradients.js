"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxesGradients = ChartsAxesGradients;
exports.useChartGradient = useChartGradient;
var React = _interopRequireWildcard(require("react"));
var _CartesianProvider = require("../../../context/CartesianProvider");
var _DrawingProvider = require("../../../context/DrawingProvider");
var _hooks = require("../../../hooks");
var _ChartsPiecewiseGradient = _interopRequireDefault(require("./ChartsPiecewiseGradient"));
var _ChartsContinuousGradient = _interopRequireDefault(require("./ChartsContinuousGradient"));
var _jsxRuntime = require("react/jsx-runtime");
function useChartGradient() {
  const {
    chartId
  } = React.useContext(_DrawingProvider.DrawingContext);
  return React.useCallback((axisId, direction) => `${chartId}-gradient-${direction}-${axisId}`, [chartId]);
}
function ChartsAxesGradients() {
  const {
    top,
    height,
    bottom,
    left,
    width,
    right
  } = (0, _hooks.useDrawingArea)();
  const svgHeight = top + height + bottom;
  const svgWidth = left + width + right;
  const getGradientId = useChartGradient();
  const {
    xAxisIds,
    xAxis,
    yAxisIds,
    yAxis
  } = (0, _CartesianProvider.useCartesianContext)();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("defs", {
    children: [yAxisIds.filter(axisId => yAxis[axisId].colorMap !== undefined).map(axisId => {
      const gradientId = getGradientId(axisId, 'y');
      const {
        colorMap,
        scale,
        colorScale,
        reverse
      } = yAxis[axisId];
      if (colorMap?.type === 'piecewise') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsPiecewiseGradient.default, {
          isReversed: !reverse,
          scale: scale,
          colorMap: colorMap,
          size: svgHeight,
          gradientId: gradientId,
          direction: "y"
        }, gradientId);
      }
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradient.default, {
          isReversed: !reverse,
          scale: scale,
          colorScale: colorScale,
          colorMap: colorMap,
          size: svgHeight,
          gradientId: gradientId,
          direction: "y"
        }, gradientId);
      }
      return null;
    }), xAxisIds.filter(axisId => xAxis[axisId].colorMap !== undefined).map(axisId => {
      const gradientId = getGradientId(axisId, 'x');
      const {
        colorMap,
        scale,
        reverse,
        colorScale
      } = xAxis[axisId];
      if (colorMap?.type === 'piecewise') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsPiecewiseGradient.default, {
          isReversed: reverse,
          scale: scale,
          colorMap: colorMap,
          size: svgWidth,
          gradientId: gradientId,
          direction: "x"
        }, gradientId);
      }
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradient.default, {
          isReversed: reverse,
          scale: scale,
          colorScale: colorScale,
          colorMap: colorMap,
          size: svgWidth,
          gradientId: gradientId,
          direction: "x"
        }, gradientId);
      }
      return null;
    })]
  });
}