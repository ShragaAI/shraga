import { AxisInteractionData } from '../context/InteractionProvider';
import { SeriesId } from '../models/seriesType/common';
import { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
export interface UseAxisTooltipReturnValue<SeriesT extends CartesianChartSeriesType = CartesianChartSeriesType, AxisValueT extends string | number | Date = string | number | Date> {
    identifier: AxisInteractionData;
    seriesItems: SeriesItem<SeriesT>[];
    axisValue: AxisValueT;
    axisFormattedValue: string;
}
interface SeriesItem<T extends CartesianChartSeriesType> {
    seriesId: SeriesId;
    color: string;
    value: ChartsSeriesConfig[T]['valueType'];
    formattedValue: string;
    formattedLabel: string | null;
}
export declare function useAxisTooltip(): null | UseAxisTooltipReturnValue;
export {};
