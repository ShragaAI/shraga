'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["width", "height", "resolveSizeBeforeRender", "margin", "children", "series", "colors", "dataset", "desc", "disableAxisListener", "highlightedItem", "onHighlightChange", "plugins", "sx", "title", "viewBox", "xAxis", "yAxis", "zAxis", "skipAnimation"];
import { useChartContainerDimensions } from "./useChartContainerDimensions.js";
export const useResponsiveChartContainerProps = (props, ref) => {
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    containerRef,
    width: dWidth,
    height: dHeight
  } = useChartContainerDimensions(width, height, resolveSizeBeforeRender);
  const resizableChartContainerProps = _extends({}, other, {
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