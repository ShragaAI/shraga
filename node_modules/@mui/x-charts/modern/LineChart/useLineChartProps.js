'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "dataset", "sx", "tooltip", "onAxisClick", "onAreaClick", "onLineClick", "onMarkClick", "axisHighlight", "disableLineItemHighlight", "legend", "grid", "topAxis", "leftAxis", "rightAxis", "bottomAxis", "children", "slots", "slotProps", "skipAnimation", "loading", "highlightedItem", "onHighlightChange", "className", "experimentalMarkRendering"];
import useId from '@mui/utils/useId';
import { DEFAULT_X_AXIS_KEY } from "../constants/index.js";
/**
 * A helper function that extracts LineChartProps from the input props
 * and returns an object with props for the children components of LineChart.
 *
 * @param props The input props for LineChart
 * @returns An object with props for the children components of LineChart
 */
export const useLineChartProps = props => {
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const id = useId();
  const clipPathId = `${id}-clip-path`;
  const chartContainerProps = _extends({}, other, {
    series: series.map(s => _extends({
      disableHighlight: !!disableLineItemHighlight,
      type: 'line'
    }, s)),
    width,
    height,
    margin,
    colors,
    dataset,
    xAxis: xAxis ?? [{
      id: DEFAULT_X_AXIS_KEY,
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
  const axisHighlightProps = _extends({
    x: 'line'
  }, axisHighlight);
  const lineHighlightPlotProps = {
    slots,
    slotProps
  };
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