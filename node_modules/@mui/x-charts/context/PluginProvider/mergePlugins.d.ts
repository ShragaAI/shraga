import { ChartsPlugin } from './Plugin.types';
import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesFormatter, SeriesFormatterConfig } from './SeriesFormatter.types';
import { ColorProcessor, ColorProcessorsConfig } from './ColorProcessor.types';
import { ExtremumGetter, ExtremumGettersConfig } from './ExtremumGetter.types';
export declare const defaultPlugins: ({
    seriesType: "bar";
    seriesFormatter: SeriesFormatter<"bar">;
    colorProcessor: ColorProcessor<"bar">;
    xExtremumGetter?: ExtremumGetter<"bar"> | undefined;
    yExtremumGetter?: ExtremumGetter<"bar"> | undefined;
    rotationExtremumGetter?: ExtremumGetter<"bar"> | undefined;
    radiusExtremumGetter?: ExtremumGetter<"bar"> | undefined;
} | {
    seriesType: "scatter";
    seriesFormatter: SeriesFormatter<"scatter">;
    colorProcessor: ColorProcessor<"scatter">;
    xExtremumGetter?: ExtremumGetter<"scatter"> | undefined;
    yExtremumGetter?: ExtremumGetter<"scatter"> | undefined;
    rotationExtremumGetter?: ExtremumGetter<"scatter"> | undefined;
    radiusExtremumGetter?: ExtremumGetter<"scatter"> | undefined;
} | {
    seriesType: "line";
    seriesFormatter: SeriesFormatter<"line">;
    colorProcessor: ColorProcessor<"line">;
    xExtremumGetter?: ExtremumGetter<"line"> | undefined;
    yExtremumGetter?: ExtremumGetter<"line"> | undefined;
    rotationExtremumGetter?: ExtremumGetter<"line"> | undefined;
    radiusExtremumGetter?: ExtremumGetter<"line"> | undefined;
} | {
    seriesType: "pie";
    seriesFormatter: SeriesFormatter<"pie">;
    colorProcessor: ColorProcessor<"pie">;
    xExtremumGetter?: ExtremumGetter<"pie"> | undefined;
    yExtremumGetter?: ExtremumGetter<"pie"> | undefined;
    rotationExtremumGetter?: ExtremumGetter<"pie"> | undefined;
    radiusExtremumGetter?: ExtremumGetter<"pie"> | undefined;
})[];
export declare function mergePlugins(plugins?: ChartsPlugin<ChartSeriesType>[]): {
    seriesFormatters: SeriesFormatterConfig<keyof import("../../internals").ChartsSeriesConfig>;
    colorProcessors: ColorProcessorsConfig<keyof import("../../internals").ChartsSeriesConfig>;
    xExtremumGetters: ExtremumGettersConfig<keyof import("../../internals").ChartsSeriesConfig>;
    yExtremumGetters: ExtremumGettersConfig<keyof import("../../internals").ChartsSeriesConfig>;
    rotationExtremumGetters: ExtremumGettersConfig<keyof import("../../internals").ChartsSeriesConfig>;
    radiusExtremumGetters: ExtremumGettersConfig<keyof import("../../internals").ChartsSeriesConfig>;
};
