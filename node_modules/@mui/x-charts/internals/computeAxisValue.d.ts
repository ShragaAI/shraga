import { AxisConfig, ScaleName } from '../models';
import { ChartsXAxisProps, ChartsAxisProps, ChartsYAxisProps, ChartsRadiusAxisProps, ChartsRotationAxisProps } from '../models/axis';
import { CartesianChartSeriesType } from '../models/seriesType/config';
import { DrawingArea } from '../context/DrawingProvider';
import { FormattedSeries } from '../context/SeriesProvider';
import { ExtremumGetter } from '../context/PluginProvider';
import { DefaultizedAxisConfig, ZoomData, ZoomOptions, GetZoomAxisFilters } from '../context/CartesianProvider/Cartesian.types';
type ComputeResult<T extends ChartsAxisProps> = {
    axis: DefaultizedAxisConfig<T>;
    axisIds: string[];
};
type ComputeCommonParams = {
    drawingArea: DrawingArea;
    formattedSeries: FormattedSeries;
    extremumGetters: {
        [K in CartesianChartSeriesType]?: ExtremumGetter<K>;
    };
    zoomData?: ZoomData[];
    zoomOptions?: ZoomOptions;
    getFilters?: GetZoomAxisFilters;
};
export declare function computeAxisValue(options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsYAxisProps>[];
    axisDirection: 'y';
}): ComputeResult<ChartsYAxisProps>;
export declare function computeAxisValue(options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsXAxisProps>[];
    axisDirection: 'x';
}): ComputeResult<ChartsAxisProps>;
export declare function computeAxisValue(options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsRadiusAxisProps>[];
    axisDirection: 'radius';
}): ComputeResult<ChartsRadiusAxisProps>;
export declare function computeAxisValue(options: ComputeCommonParams & {
    axis: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
    axisDirection: 'rotation';
}): ComputeResult<ChartsRotationAxisProps>;
export {};
