"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useResponsiveChartContainerProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _useChartContainerDimensions = require("./useChartContainerDimensions");
const _excluded = ["width", "height", "resolveSizeBeforeRender", "margin", "children", "series", "colors", "dataset", "desc", "disableAxisListener", "highlightedItem", "onHighlightChange", "plugins", "sx", "title", "viewBox", "xAxis", "yAxis", "zAxis", "skipAnimation"];
const useResponsiveChartContainerProps = (props, ref) => {
  const {
      width,
      height,
      resolveSizeBeforeRender,
      margin,
      children,
      series,
      colors,
      dataset,
      desc,
      disableAxisListener,
      highlightedItem,
      onHighlightChange,
      plugins,
      sx,
      title,
      viewBox,
      xAxis,
      yAxis,
      zAxis,
      skipAnimation
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    containerRef,
    width: dWidth,
    height: dHeight
  } = (0, _useChartContainerDimensions.useChartContainerDimensions)(width, height, resolveSizeBeforeRender);
  const resizableChartContainerProps = (0, _extends2.default)({}, other, {
    ownerState: {
      width,
      height
    },
    ref: containerRef
  });
  const chartContainerProps = {
    margin,
    children,
    series,
    colors,
    dataset,
    desc,
    disableAxisListener,
    highlightedItem,
    onHighlightChange,
    plugins,
    sx,
    title,
    viewBox,
    xAxis,
    yAxis,
    zAxis,
    skipAnimation,
    width: dWidth,
    height: dHeight,
    ref
  };
  return {
    hasIntrinsicSize: dWidth && dHeight,
    chartContainerProps,
    resizableChartContainerProps
  };
};
exports.useResponsiveChartContainerProps = useResponsiveChartContainerProps;