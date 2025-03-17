"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExtremumY = exports.getExtremumX = void 0;
const getExtremumX = params => {
  const {
    axis
  } = params;
  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};
exports.getExtremumX = getExtremumX;
function getSeriesExtremums(getValues, stackedData, filter) {
  return stackedData.reduce((seriesAcc, stackedValue, index) => {
    const [base, value] = getValues(stackedValue);
    if (filter && (!filter({
      y: base,
      x: null
    }, index) || !filter({
      y: value,
      x: null
    }, index))) {
      return seriesAcc;
    }
    return [Math.min(base, value, seriesAcc[0]), Math.max(base, value, seriesAcc[1])];
  }, [Infinity, -Infinity]);
}
const getExtremumY = params => {
  const {
    series,
    axis,
    isDefaultAxis,
    getFilters
  } = params;
  return Object.keys(series).filter(seriesId => {
    const yAxisId = series[seriesId].yAxisId ?? series[seriesId].yAxisKey;
    return yAxisId === axis.id || isDefaultAxis && yAxisId === undefined;
  }).reduce((acc, seriesId) => {
    const {
      area,
      stackedData
    } = series[seriesId];
    const isArea = area !== undefined;
    const filter = getFilters?.({
      currentAxisId: axis.id,
      isDefaultAxis,
      seriesXAxisId: series[seriesId].xAxisId ?? series[seriesId].xAxisKey,
      seriesYAxisId: series[seriesId].yAxisId ?? series[seriesId].yAxisKey
    });

    // Since this series is not used to display an area, we do not consider the base (the d[0]).
    const getValues = isArea && axis.scaleType !== 'log' && typeof series[seriesId].baseline !== 'string' ? d => d : d => [d[1], d[1]];
    const seriesExtremums = getSeriesExtremums(getValues, stackedData, filter);
    const [seriesMin, seriesMax] = seriesExtremums;
    return [Math.min(seriesMin, acc[0]), Math.max(seriesMax, acc[1])];
  }, [Infinity, -Infinity]);
};
exports.getExtremumY = getExtremumY;