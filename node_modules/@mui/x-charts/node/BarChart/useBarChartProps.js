"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBarChartProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _useId = _interopRequireDefault(require("@mui/utils/useId"));
var _constants = require("../constants");
const _excluded = ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "tooltip", "onAxisClick", "axisHighlight", "legend", "grid", "topAxis", "leftAxis", "rightAxis", "bottomAxis", "children", "slots", "slotProps", "skipAnimation", "loading", "layout", "onItemClick", "highlightedItem", "onHighlightChange", "borderRadius", "barLabel", "className"];
/**
 * A helper function that extracts BarChartProps from the input props
 * and returns an object with props for the children components of BarChart.
 *
 * @param props The input props for BarChart
 * @returns An object with props for the children components of BarChart
 */
const useBarChartProps = props => {
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
      axisHighlight,
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
      layout,
      onItemClick,
      highlightedItem,
      onHighlightChange,
      borderRadius,
      barLabel,
      className
    } = props,
    rest = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const id = (0, _useId.default)();
  const clipPathId = `${id}-clip-path`;
  const hasHorizontalSeries = layout === 'horizontal' || layout === undefined && series.some(item => item.layout === 'horizontal');
  const defaultAxisConfig = {
    scaleType: 'band',
    data: Array.from({
      length: Math.max(...series.map(s => (s.data ?? dataset ?? []).length))
    }, (_, index) => index)
  };
  const chartContainerProps = (0, _extends2.default)({}, rest, {
    series: series.map(s => (0, _extends2.default)({
      type: 'bar'
    }, s, {
      layout: hasHorizontalSeries ? 'horizontal' : 'vertical'
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: xAxis ?? (hasHorizontalSeries ? undefined : [(0, _extends2.default)({
      id: _constants.DEFAULT_X_AXIS_KEY
    }, defaultAxisConfig)]),
    yAxis: yAxis ?? (hasHorizontalSeries ? [(0, _extends2.default)({
      id: _constants.DEFAULT_Y_AXIS_KEY
    }, defaultAxisConfig)] : undefined),
    sx,
    highlightedItem,
    onHighlightChange,
    disableAxisListener: tooltip?.trigger !== 'axis' && axisHighlight?.x === 'none' && axisHighlight?.y === 'none' && !onAxisClick,
    className,
    skipAnimation
  });
  const barPlotProps = {
    onItemClick,
    slots,
    slotProps,
    borderRadius,
    barLabel
  };
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
  const axisHighlightProps = (0, _extends2.default)({}, hasHorizontalSeries ? {
    y: 'band'
  } : {
    x: 'band'
  }, axisHighlight);
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
    barPlotProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    legendProps,
    tooltipProps,
    children
  };
};
exports.useBarChartProps = useBarChartProps;