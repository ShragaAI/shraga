import { AxisDefaultized, AxisId } from '../models/axis';
import { SeriesId } from '../models/seriesType/common';
export declare function checkScaleErrors(verticalLayout: boolean, seriesId: SeriesId, xAxisId: AxisId, xAxis: {
    [axisId: AxisId]: AxisDefaultized;
}, yAxisId: AxisId, yAxis: {
    [axisId: AxisId]: AxisDefaultized;
}): void;
