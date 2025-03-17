"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useBarSeries = useBarSeries;
exports.useLineSeries = useLineSeries;
exports.usePieSeries = usePieSeries;
exports.useScatterSeries = useScatterSeries;
exports.useSeries = useSeries;
var React = _interopRequireWildcard(require("react"));
var _SeriesProvider = require("../context/SeriesProvider");
/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
function useSeries() {
  const {
    isInitialized,
    data
  } = React.useContext(_SeriesProvider.SeriesContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the series ref context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  return data;
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedPieSeriesType>; seriesOrder: SeriesId[]; } | undefined}  pieSeries
 */
function usePieSeries() {
  const series = useSeries();
  return React.useMemo(() => series.pie, [series.pie]);
}

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedLineSeriesType>; seriesOrder: SeriesId[]; } | undefined}  lineSeries
 */
function useLineSeries() {
  const series = useSeries();
  return React.useMemo(() => series.line, [series.line]);
}

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedBarSeriesType>; seriesOrder: SeriesId[]; } | undefined}  barSeries
 */
function useBarSeries() {
  const series = useSeries();
  return React.useMemo(() => series.bar, [series.bar]);
}

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedScatterSeriesType>; seriesOrder: SeriesId[]; } | undefined}  scatterSeries
 */
function useScatterSeries() {
  const series = useSeries();
  return React.useMemo(() => series.scatter, [series.scatter]);
}