"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAxisExtremum = void 0;
const axisExtremumCallback = (acc, chartType, axis, getters, axisIndex, formattedSeries, getFilters) => {
  const getter = getters[chartType];
  const series = formattedSeries[chartType]?.series ?? {};
  const [minChartTypeData, maxChartTypeData] = getter?.({
    series,
    axis,
    axisIndex,
    isDefaultAxis: axisIndex === 0,
    getFilters
  }) ?? [Infinity, -Infinity];
  const [minData, maxData] = acc;
  return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};
const getAxisExtremum = (axis, getters, axisIndex, formattedSeries, getFilters) => {
  const charTypes = Object.keys(getters);
  const extremums = charTypes.reduce((acc, charType) => axisExtremumCallback(acc, charType, axis, getters, axisIndex, formattedSeries, getFilters), [Infinity, -Infinity]);
  if (Number.isNaN(extremums[0]) || Number.isNaN(extremums[1])) {
    return [Infinity, -Infinity];
  }
  return extremums;
};
exports.getAxisExtremum = getAxisExtremum;