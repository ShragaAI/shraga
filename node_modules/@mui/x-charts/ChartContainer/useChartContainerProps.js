'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["width", "height", "series", "margin", "xAxis", "yAxis", "zAxis", "colors", "dataset", "sx", "title", "desc", "disableAxisListener", "highlightedItem", "onHighlightChange", "plugins", "children", "skipAnimation"];
import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import { useDefaultizeAxis } from "./useDefaultizeAxis.js";
export const useChartContainerProps = (props, ref) => {
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const svgRef = React.useRef(null);
  const chartSurfaceRef = useForkRef(ref, svgRef);
  const [defaultizedXAxis, defaultizedYAxis] = useDefaultizeAxis(xAxis, yAxis, dataset);
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
  const chartsSurfaceProps = _extends({}, other, {
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