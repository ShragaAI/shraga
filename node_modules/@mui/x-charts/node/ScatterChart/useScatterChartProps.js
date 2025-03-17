"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScatterChartProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
const _excluded = ["xAxis", "yAxis", "zAxis", "series", "tooltip", "axisHighlight", "voronoiMaxRadius", "disableVoronoi", "legend", "width", "height", "margin", "colors", "sx", "grid", "topAxis", "leftAxis", "rightAxis", "bottomAxis", "onItemClick", "children", "slots", "slotProps", "loading", "highlightedItem", "onHighlightChange", "className"];
/**
 * A helper function that extracts ScatterChartProps from the input props
 * and returns an object with props for the children components of ScatterChart.
 *
 * @param props The input props for ScatterChart
 * @returns An object with props for the children components of ScatterChart
 */
const useScatterChartProps = props => {
  const {
      xAxis,
      yAxis,
      zAxis,
      series,
      tooltip,
      axisHighlight,
      voronoiMaxRadius,
      disableVoronoi,
      legend,
      width,
      height,
      margin,
      colors,
      sx,
      grid,
      topAxis,
      leftAxis,
      rightAxis,
      bottomAxis,
      onItemClick,
      children,
      slots,
      slotProps,
      loading,
      highlightedItem,
      onHighlightChange,
      className
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const chartContainerProps = (0, _extends2.default)({}, other, {
    series: series.map(s => (0, _extends2.default)({
      type: 'scatter'
    }, s)),
    width,
    height,
    margin,
    colors,
    xAxis,
    yAxis,
    sx,
    highlightedItem,
    onHighlightChange,
    className
  });
  const zAxisProps = {
    zAxis
  };
  const voronoiHandlerProps = {
    voronoiMaxRadius,
    onItemClick: onItemClick
  };
  const chartsAxisProps = {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps
  };
  const gridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal
  };
  const scatterPlotProps = {
    onItemClick: disableVoronoi ? onItemClick : undefined,
    slots,
    slotProps
  };
  const overlayProps = {
    loading,
    slots,
    slotProps
  };
  const legendProps = (0, _extends2.default)({}, legend, {
    slots,
    slotProps
  });
  const axisHighlightProps = (0, _extends2.default)({
    y: 'none',
    x: 'none'
  }, axisHighlight);
  const tooltipProps = (0, _extends2.default)({
    trigger: 'item'
  }, tooltip, {
    slots,
    slotProps
  });
  return {
    chartContainerProps,
    zAxisProps,
    voronoiHandlerProps,
    chartsAxisProps,
    gridProps,
    scatterPlotProps,
    overlayProps,
    legendProps,
    axisHighlightProps,
    tooltipProps,
    children
  };
};
exports.useScatterChartProps = useScatterChartProps;