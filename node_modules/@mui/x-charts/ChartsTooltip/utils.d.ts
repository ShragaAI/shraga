import { AxisInteractionData, ItemInteractionData } from '../context/InteractionProvider';
import { ChartSeriesType } from '../models/seriesType/config';
type MousePosition = {
    x: number;
    y: number;
    pointerType: 'mouse' | 'touch' | 'pen';
    height: number;
};
export declare function generateVirtualElement(mousePosition: MousePosition | null): {
    getBoundingClientRect: () => {
        width: number;
        height: number;
        x: number;
        y: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
        toJSON: () => string;
    };
};
export type UseMouseTrackerReturnValue = null | MousePosition;
export declare function useMouseTracker(): UseMouseTrackerReturnValue;
export type TriggerOptions = 'item' | 'axis' | 'none';
export declare function getTooltipHasData(trigger: TriggerOptions, displayedData: null | AxisInteractionData | ItemInteractionData<ChartSeriesType>): boolean;
export declare function utcFormatter(v: string | number | Date): string;
export {};
