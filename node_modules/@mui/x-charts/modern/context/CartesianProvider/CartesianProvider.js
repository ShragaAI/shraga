'use client';

import * as React from 'react';
import { computeAxisValue } from "../../internals/computeAxisValue.js";
import { useDrawingArea } from "../../hooks/useDrawingArea.js";
import { useSeries } from "../../hooks/useSeries.js";
import { CartesianContext } from "./CartesianContext.js";
import { useXExtremumGetter } from "../PluginProvider/useXExtremumGetter.js";
import { useYExtremumGetter } from "../PluginProvider/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
function CartesianProvider(props) {
  const {
    xAxis,
    yAxis,
    children
  } = props;
  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const xExtremumGetters = useXExtremumGetter();
  const yExtremumGetters = useYExtremumGetter();
  const xValues = React.useMemo(() => computeAxisValue({
    drawingArea,
    formattedSeries,
    axis: xAxis,
    extremumGetters: xExtremumGetters,
    axisDirection: 'x'
  }), [drawingArea, formattedSeries, xAxis, xExtremumGetters]);
  const yValues = React.useMemo(() => computeAxisValue({
    drawingArea,
    formattedSeries,
    axis: yAxis,
    extremumGetters: yExtremumGetters,
    axisDirection: 'y'
  }), [drawingArea, formattedSeries, yAxis, yExtremumGetters]);
  const value = React.useMemo(() => ({
    isInitialized: true,
    data: {
      xAxis: xValues.axis,
      yAxis: yValues.axis,
      xAxisIds: xValues.axisIds,
      yAxisIds: yValues.axisIds
    }
  }), [xValues, yValues]);
  return /*#__PURE__*/_jsx(CartesianContext.Provider, {
    value: value,
    children: children
  });
}
export { CartesianProvider };