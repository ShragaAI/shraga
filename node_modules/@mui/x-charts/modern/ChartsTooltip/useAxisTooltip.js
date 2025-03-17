'use client';

import * as React from 'react';
import { InteractionContext } from "../context/InteractionProvider.js";
import { useSeries } from "../hooks/useSeries.js";
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { ZAxisContext } from "../context/ZAxisContextProvider.js";
import { useColorProcessor } from "../context/PluginProvider/useColorProcessor.js";
import { getLabel } from "../internals/getLabel.js";
import { isCartesianSeriesType } from "../internals/isCartesian.js";
import { utcFormatter } from "./utils.js";
export function useAxisTooltip() {
  const {
    axis
  } = React.useContext(InteractionContext);
  const series = useSeries();
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = useCartesianContext();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(ZAxisContext);
  const colorProcessors = useColorProcessor();

  // By default use the x-axis
  const isXaxis = axis.x !== null && axis.x.index !== -1;
  const axisData = isXaxis ? axis.x && axis.x : axis.y && axis.y;
  if (axisData === null) {
    return null;
  }
  const {
    index: dataIndex,
    value: axisValue
  } = axisData;
  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
  const usedAxis = isXaxis ? xAxis[USED_AXIS_ID] : yAxis[USED_AXIS_ID];
  const relevantSeries = Object.keys(series).filter(isCartesianSeriesType).flatMap(seriesType => {
    const seriesOfType = series[seriesType];
    if (!seriesOfType) {
      return [];
    }
    return seriesOfType.seriesOrder.map(seriesId => {
      const seriesToAdd = seriesOfType.series[seriesId];
      const providedXAxisId = seriesToAdd.xAxisId ?? seriesToAdd.xAxisKey;
      const providedYAxisId = seriesToAdd.yAxisId ?? seriesToAdd.yAxisKey;
      const axisKey = isXaxis ? providedXAxisId : providedYAxisId;

      // Test if the series uses the default axis
      if (axisKey === undefined || axisKey === USED_AXIS_ID) {
        const xAxisId = providedXAxisId ?? xAxisIds[0];
        const yAxisId = providedYAxisId ?? yAxisIds[0];
        const zAxisId = seriesToAdd.zAxisId ?? seriesToAdd.zAxisKey ?? zAxisIds[0];
        const color = colorProcessors[seriesType]?.(seriesToAdd, xAxis[xAxisId], yAxis[yAxisId], zAxisId && zAxis[zAxisId])(dataIndex) ?? '';
        const value = seriesToAdd.data[dataIndex] ?? null;
        const formattedValue = seriesToAdd.valueFormatter(value, {
          dataIndex
        });
        const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;
        return {
          seriesId,
          color,
          value,
          formattedValue,
          formattedLabel
        };
      }
      return undefined;
    });
  }).filter(item => item != null);
  const axisFormatter = usedAxis.valueFormatter ?? (v => usedAxis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());
  const axisFormattedValue = axisFormatter(axisValue, {
    location: 'tooltip'
  });
  return {
    identifier: axis,
    seriesItems: relevantSeries,
    axisValue,
    axisFormattedValue
  };
}