export * from './SeriesProvider';
export * from './SeriesContext';
export * from './Series.types';
declare const seriesProviderUtils: {
    preprocessSeries: <T extends import("../../internals").ChartSeriesType>({ series, colors, seriesFormatters, dataset, }: {
        series: import("../..").AllSeriesType<T>[];
        colors: string[];
        seriesFormatters: import("../PluginProvider").SeriesFormatterConfig<T>;
        dataset?: import("../../internals").DatasetType;
    }) => import("./Series.types").FormattedSeries;
};
export { seriesProviderUtils };
