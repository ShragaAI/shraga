import { ItemInteractionData } from '../context/InteractionProvider';
import { ChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
export interface UseItemTooltipReturnValue<T extends ChartSeriesType> {
    identifier: ItemInteractionData<T>;
    color: string;
    label: string | undefined;
    value: ChartsSeriesConfig[T]['valueType'];
    formattedValue: string | undefined;
}
export declare function useItemTooltip<T extends ChartSeriesType>(): null | UseItemTooltipReturnValue<T>;
