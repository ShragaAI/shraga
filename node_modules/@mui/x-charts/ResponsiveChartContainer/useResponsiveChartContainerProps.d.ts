import type { ResponsiveChartContainerProps } from './ResponsiveChartContainer';
export declare const useResponsiveChartContainerProps: (props: ResponsiveChartContainerProps, ref: React.ForwardedRef<unknown>) => {
    hasIntrinsicSize: number;
    chartContainerProps: Omit<import("..").ChartsSurfaceProps & Omit<import("../internals").SeriesProviderProps, "seriesFormatters"> & Omit<import("../internals").DrawingProviderProps, "svgRef"> & Pick<import("../internals").CartesianProviderProps, "dataset"> & import("..").ZAxisContextProviderProps & import("..").HighlightedProviderProps & import("../internals").PluginProviderProps & import("../internals").AnimationProviderProps, "children"> & {
        xAxis?: import("../internals").MakeOptional<import("..").AxisConfig<import("..").ScaleName, any, import("..").ChartsXAxisProps>, "id">[];
        yAxis?: import("../internals").MakeOptional<import("..").AxisConfig<import("..").ScaleName, any, import("..").ChartsYAxisProps>, "id">[];
        children?: React.ReactNode;
    } & {
        ref: React.ForwardedRef<unknown>;
    };
    resizableChartContainerProps: {
        ownerState: {
            width: number | undefined;
            height: number | undefined;
        };
        ref: import("react").RefObject<null>;
        className?: string | undefined;
    };
};
