'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "tooltip", "onAxisClick", "axisHighlight", "legend", "grid", "topAxis", "leftAxis", "rightAxis", "bottomAxis", "children", "slots", "slotProps", "skipAnimation", "loading", "layout", "onItemClick", "highlightedItem", "onHighlightChange", "borderRadius", "barLabel", "className"];
import useId from '@mui/utils/useId';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from "../constants/index.js";
/**
 * A helper function that extracts BarChartProps from the input props
 * and returns an object with props for the children components of BarChart.
 *
 * @param props The input props for BarChart
 * @returns An object with props for the children components of BarChart
 */
export const useBarChartProps = props => {
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
    rest = _objectWithoutPropertiesLoose(props, _excluded);
  const id = useId();
  const clipPathId = `${id}-clip-path`;
  const hasHorizontalSeries = layout === 'horizontal' || layout === undefined && series.some(item => item.layout === 'horizontal');
  const defaultAxisConfig = {
    scaleType: 'band',
    data: Array.from({
      length: Math.max(...series.map(s => (s.data ?? dataset ?? []).length))
    }, (_, index) => index)
  };
  const chartContainerProps = _extends({}, rest, {
    series: series.map(s => _extends({
      type: 'bar'
    }, s, {
      layout: hasHorizontalSeries ? 'horizontal' : 'vertical'
    })),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: xAxis ?? (hasHorizontalSeries ? undefined : [_extends({
      id: DEFAULT_X_AXIS_KEY
    }, defaultAxisConfig)]),
    yAxis: yAxis ?? (hasHorizontalSeries ? [_extends({
      id: DEFAULT_Y_AXIS_KEY
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
  const axisHighlightProps = _extends({}, hasHorizontalSeries ? {
    y: 'band'
  } : {
    x: 'band'
  }, axisHighlight);
  const legendProps = _extends({}, legend, {
    slots,
    slotProps
  });
  const tooltipProps = _extends({}, tooltip, {
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