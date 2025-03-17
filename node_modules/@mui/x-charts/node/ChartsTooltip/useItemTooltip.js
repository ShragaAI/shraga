"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useItemTooltip = useItemTooltip;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../context/InteractionProvider");
var _useSeries = require("../hooks/useSeries");
var _CartesianProvider = require("../context/CartesianProvider");
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _useColorProcessor = require("../context/PluginProvider/useColorProcessor");
var _getLabel = require("../internals/getLabel");
function useItemTooltip() {
  const {
    item
  } = React.useContext(_InteractionProvider.InteractionContext);
  const series = (0, _useSeries.useSeries)();
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
  const colorProcessors = (0, _useColorProcessor.useColorProcessor)();
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
    const label = (0, _getLabel.getLabel)(point.label, 'tooltip');
    const value = (0, _extends2.default)({}, point, {
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
  const label = (0, _getLabel.getLabel)(itemSeries.label, 'tooltip');
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