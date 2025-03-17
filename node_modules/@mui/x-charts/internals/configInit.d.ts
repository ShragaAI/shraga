import { ChartSeriesType } from '../models/seriesType/config';
declare class CartesianSeriesTypes {
    types: Set<ChartSeriesType>;
    constructor();
    addType(value: ChartSeriesType): void;
    getTypes(): Set<keyof import(".").ChartsSeriesConfig>;
}
export declare const cartesianSeriesTypes: CartesianSeriesTypes;
export {};
