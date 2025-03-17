"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxisTooltip = useAxisTooltip;
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../context/InteractionProvider");
var _useSeries = require("../hooks/useSeries");
var _CartesianProvider = require("../context/CartesianProvider");
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _useColorProcessor = require("../context/PluginProvider/useColorProcessor");
var _getLabel = require("../internals/getLabel");
var _isCartesian = require("../internals/isCartesian");
var _utils = require("./utils");
function useAxisTooltip() {
  const {
    axis
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
  const relevantSeries = Object.keys(series).filter(_isCartesian.isCartesianSeriesType).flatMap(seriesType => {
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
        const formattedLabel = (0, _getLabel.getLabel)(seriesToAdd.label, 'tooltip') ?? null;
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
  const axisFormatter = usedAxis.valueFormatter ?? (v => usedAxis.scaleType === 'utc' ? (0, _utils.utcFormatter)(v) : v.toLocaleString());
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