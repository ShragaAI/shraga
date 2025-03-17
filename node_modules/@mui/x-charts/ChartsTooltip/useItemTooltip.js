'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { InteractionContext } from "../context/InteractionProvider.js";
import { useSeries } from "../hooks/useSeries.js";
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { ZAxisContext } from "../context/ZAxisContextProvider.js";
import { useColorProcessor } from "../context/PluginProvider/useColorProcessor.js";
import { getLabel } from "../internals/getLabel.js";
export function useItemTooltip() {
  const {
    item
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
  const xAxisId = series.xAxisId ?? series.xAxisKey ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? series.yAxisKey ?? yAxisIds[0];
  const zAxisId = series.zAxisId ?? series.zAxisKey ?? zAxisIds[0];
  if (!item || item.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series[item.type].series[item.seriesId];
  const getColor = colorProcessors[itemSeries.type]?.(itemSeries, xAxisId && xAxis[xAxisId], yAxisId && yAxis[yAxisId], zAxisId && zAxis[zAxisId]) ?? (() => '');
  if (itemSeries.type === 'pie') {
    const point = itemSeries.data[item.dataIndex];
    const label = getLabel(point.label, 'tooltip');
    const value = _extends({}, point, {
      label
    });
    const formattedValue = itemSeries.valueFormatter?.(value, {
      dataIndex: item.dataIndex
    });
    return {
      identifier: item,
      color: getColor(item.dataIndex),
      label,
      value,
      formattedValue
    };
  }
  const label = getLabel(itemSeries.label, 'tooltip');
  const value = itemSeries.data[item.dataIndex];
  const formattedValue = itemSeries.valueFormatter?.(value, {
    dataIndex: item.dataIndex
  });
  return {
    identifier: item,
    color: getColor(item.dataIndex),
    label,
    value,
    formattedValue
  };
}