import * as React from 'react';
import { DrawingProviderProps } from '../context/DrawingProvider';
import { SeriesProviderProps } from '../context/SeriesProvider';
import { ChartsSurfaceProps } from '../ChartsSurface';
import { CartesianProviderProps } from '../context/CartesianProvider';
import { HighlightedProviderProps, ZAxisContextProviderProps } from '../context';
import { PluginProviderProps } from '../context/PluginProvider';
import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../models/axis';
import { MakeOptional } from '../models/helpers';
import { AnimationProviderProps } from '../context/AnimationProvider';
export type ChartContainerProps = Omit<ChartsSurfaceProps & Omit<SeriesProviderProps, 'seriesFormatters'> & Omit<DrawingProviderProps, 'svgRef'> & Pick<CartesianProviderProps, 'dataset'> & ZAxisContextProviderProps & HighlightedProviderProps & PluginProviderProps & AnimationProviderProps, 'children'> & {
    /**
     * The configuration of the x-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>[];
    /**
     * The configuration of the y-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>[];
    children?: React.ReactNode;
};
declare const ChartContainer: React.ForwardRefExoticComponent<Omit<ChartsSurfaceProps & Omit<SeriesProviderProps, "seriesFormatters"> & Omit<DrawingProviderProps, "svgRef"> & Pick<CartesianProviderProps, "dataset"> & ZAxisContextProviderProps & HighlightedProviderProps & PluginProviderProps & AnimationProviderProps, "children"> & {
    /**
     * The configuration of the x-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    xAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, "id">[];
    /**
     * The configuration of the y-axes.
     * If not provided, a default axis config is used.
     * An array of [[AxisConfig]] objects.
     */
    yAxis?: MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, "id">[];
    children?: React.ReactNode;
} & React.RefAttributes<unknown>>;
export { ChartContainer };
