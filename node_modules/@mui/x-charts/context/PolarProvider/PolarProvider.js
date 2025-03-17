'use client';

import * as React from 'react';
import { computeAxisValue } from "../../internals/computeAxisValue.js";
import { useDrawingArea } from "../../hooks/useDrawingArea.js";
import { useSeries } from "../../hooks/useSeries.js";
import { PolarContext } from "./PolarContext.js";
import { useRadiusExtremumGetter } from "../PluginProvider/useRadiusExtremumGetter.js";
import { useRotationExtremumGetter } from "../PluginProvider/useRotationExtremumGetter.js";
import { jsx as _jsx } from "react/jsx-runtime";
function PolarProvider(props) {
  const {
    rotationAxis,
    radiusAxis,
    children
  } = props;
  const formattedSeries = useSeries();
  const drawingArea = useDrawingArea();
  const rotationExtremumGetters = useRotationExtremumGetter();
  const radiusExtremumGetters = useRadiusExtremumGetter();
  const rotationValues = React.useMemo(() => computeAxisValue({
    drawingArea,
    formattedSeries,
    axis: rotationAxis,
    extremumGetters: rotationExtremumGetters,
    axisDirection: 'rotation'
  }), [drawingArea, formattedSeries, rotationAxis, rotationExtremumGetters]);
  const radiusValues = React.useMemo(() => computeAxisValue({
    drawingArea,
    formattedSeries,
    axis: radiusAxis,
    extremumGetters: radiusExtremumGetters,
    axisDirection: 'radius'
  }), [drawingArea, formattedSeries, radiusAxis, radiusExtremumGetters]);
  const value = React.useMemo(() => ({
    isInitialized: true,
    data: {
      rotationAxis: rotationValues.axis,
      radiusAxis: radiusValues.axis,
      rotationAxisIds: rotationValues.axisIds,
      radiusAxisIds: radiusValues.axisIds
    }
  }), [rotationValues, radiusValues]);
  return /*#__PURE__*/_jsx(PolarContext.Provider, {
    value: value,
    children: children
  });
}
export { PolarProvider };