"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartContainerProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _useForkRef = _interopRequireDefault(require("@mui/utils/useForkRef"));
var _useDefaultizeAxis = require("./useDefaultizeAxis");
const _excluded = ["width", "height", "series", "margin", "xAxis", "yAxis", "zAxis", "colors", "dataset", "sx", "title", "desc", "disableAxisListener", "highlightedItem", "onHighlightChange", "plugins", "children", "skipAnimation"];
const useChartContainerProps = (props, ref) => {
  const {
      width,
      height,
      series,
      margin,
      xAxis,
      yAxis,
      zAxis,
      colors,
      dataset,
      sx,
      title,
      desc,
      disableAxisListener,
      highlightedItem,
      onHighlightChange,
      plugins,
      children,
      skipAnimation
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const svgRef = React.useRef(null);
  const chartSurfaceRef = (0, _useForkRef.default)(ref, svgRef);
  const [defaultizedXAxis, defaultizedYAxis] = (0, _useDefaultizeAxis.useDefaultizeAxis)(xAxis, yAxis, dataset);
  const drawingProviderProps = {
    width,
    height,
    margin,
    svgRef
  };
  const animationProviderProps = {
    skipAnimation
  };
  const pluginProviderProps = {
    plugins
  };
  const seriesProviderProps = {
    series,
    colors,
    dataset
  };
  const cartesianProviderProps = {
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis,
    dataset
  };
  const zAxisContextProps = {
    zAxis,
    dataset
  };
  const highlightedProviderProps = {
    highlightedItem,
    onHighlightChange
  };
  const chartsSurfaceProps = (0, _extends2.default)({}, other, {
    width,
    height,
    ref: chartSurfaceRef,
    sx,
    title,
    desc,
    disableAxisListener
  });
  return {
    children,
    drawingProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
    animationProviderProps,
    xAxis: defaultizedXAxis,
    yAxis: defaultizedYAxis
  };
};
exports.useChartContainerProps = useChartContainerProps;