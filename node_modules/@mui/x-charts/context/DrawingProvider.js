'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import useId from '@mui/utils/useId';
import useChartDimensions from "../hooks/useChartDimensions.js";

/**
 * Defines the area in which it is possible to draw the charts.
 */
import { jsx as _jsx } from "react/jsx-runtime";
export const DrawingContext = /*#__PURE__*/React.createContext({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 300,
  width: 400,
  chartId: '',
  isPointInside: () => false
});
if (process.env.NODE_ENV !== 'production') {
  DrawingContext.displayName = 'DrawingContext';
}
export const SvgContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    current: null
  }
});
if (process.env.NODE_ENV !== 'production') {
  SvgContext.displayName = 'SvgContext';
}
export function DrawingProvider(props) {
  const {
    width,
    height,
    margin,
    svgRef,
    children
  } = props;
  const drawingArea = useChartDimensions(width, height, margin);
  const chartId = useId();
  const isPointInside = React.useCallback(({
    x,
    y
  }, options) => {
    // For element allowed to overflow, wrapping them in <g data-drawing-container /> make them fully part of the drawing area.
    if (options?.targetElement && options?.targetElement.closest('[data-drawing-container]')) {
      return true;
    }
    const isInsideX = x >= drawingArea.left - 1 && x <= drawingArea.left + drawingArea.width;
    const isInsideY = y >= drawingArea.top - 1 && y <= drawingArea.top + drawingArea.height;
    if (options?.direction === 'x') {
      return isInsideX;
    }
    if (options?.direction === 'y') {
      return isInsideY;
    }
    return isInsideX && isInsideY;
  }, [drawingArea]);
  const value = React.useMemo(() => _extends({
    chartId: chartId ?? ''
  }, drawingArea, {
    isPointInside
  }), [chartId, drawingArea, isPointInside]);
  const refValue = React.useMemo(() => ({
    isInitialized: true,
    data: svgRef
  }), [svgRef]);
  return /*#__PURE__*/_jsx(SvgContext.Provider, {
    value: refValue,
    children: /*#__PURE__*/_jsx(DrawingContext.Provider, {
      value: value,
      children: children
    })
  });
}