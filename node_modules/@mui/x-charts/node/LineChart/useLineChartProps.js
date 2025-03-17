"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLineChartProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _useId = _interopRequireDefault(require("@mui/utils/useId"));
var _constants = require("../constants");
const _excluded = ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "tooltip", "onAxisClick", "onAreaClick", "onLineClick", "onMarkClick", "axisHighlight", "disableLineItemHighlight", "legend", "grid", "topAxis", "leftAxis", "rightAxis", "bottomAxis", "children", "slots", "slotProps", "skipAnimation", "loading", "highlightedItem", "onHighlightChange", "className", "experimentalMarkRendering"];
/**
 * A helper function that extracts LineChartProps from the input props
 * and returns an object with props for the children components of LineChart.
 *
 * @param props The input props for LineChart
 * @returns An object with props for the children components of LineChart
 */
const useLineChartProps = props => {
  const {
      xAxis,
      yAxis,
      series,
      width,
      height,
      margin,
      colors,
      dataset,
      sx,
      tooltip,
      onAxisClick,
      onAreaClick,
      onLineClick,
      onMarkClick,
      axisHighlight,
      disableLineItemHighlight,
      legend,
      grid,
      topAxis,
      leftAxis,
      rightAxis,
      bottomAxis,
      children,
      slots,
      slotProps,
      skipAnimation,
      loading,
      highlightedItem,
      onHighlightChange,
      className,
      experimentalMarkRendering
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const id = (0, _useId.default)();
  const clipPathId = `${id}-clip-path`;
  const chartContainerProps = (0, _extends2.default)({}, other, {
    series: series.map(s => (0, _extends2.default)({
      disableHighlight: !!disableLineItemHighlight,
      type: 'line'
    }, s)),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: xAxis ?? [{
      id: _constants.DEFAULT_X_AXIS_KEY,
      scaleType: 'point',
      data: Array.from({
        length: Math.max(...series.map(s => (s.data ?? dataset ?? []).length))
      }, (_, index) => index)
    }],
    yAxis,
    sx,
    highlightedItem,
    onHighlightChange,
    disableAxisListener: tooltip?.trigger !== 'axis' && axisHighlight?.x === 'none' && axisHighlight?.y === 'none' && !onAxisClick,
    className,
    skipAnimation
  });
  const axisClickHandlerProps = {
    onAxisClick
  };
  const gridProps = {
    vertical: grid?.vertical,
    horizontal: grid?.horizontal
  };
  const clipPathGroupProps = {
    clipPath: `url(#${clipPathId})`
  };
  const clipPathProps = {
    id: clipPathId
  };
  const areaPlotProps = {
    slots,
    slotProps,
    onItemClick: onAreaClick
  };
  const linePlotProps = {
    slots,
    slotProps,
    onItemClick: onLineClick
  };
  const markPlotProps = {
    slots,
    slotProps,
    onItemClick: onMarkClick,
    skipAnimation,
    experimentalRendering: experimentalMarkRendering
  };
  const overlayProps = {
    slots,
    slotProps,
    loading
  };
  const chartsAxisProps = {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps
  };
  const axisHighlightProps = (0, _extends2.default)({
    x: 'line'
  }, axisHighlight);
  const lineHighlightPlotProps = {
    slots,
    slotProps
  };
  const legendProps = (0, _extends2.default)({}, legend, {
    slots,
    slotProps
  });
  const tooltipProps = (0, _extends2.default)({}, tooltip, {
    slots,
    slotProps
  });
  return {
    chartContainerProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    areaPlotProps,
    linePlotProps,
    markPlotProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    lineHighlightPlotProps,
    legendProps,
    tooltipProps,
    children
  };
};
exports.useLineChartProps = useLineChartProps;