import { ChartSeriesType } from '../../models/seriesType/config';
import { ExtremumGettersConfig } from './ExtremumGetter.types';
export declare function useYExtremumGetter<T extends ChartSeriesType>(seriesType: T): ExtremumGettersConfig<T>[T];
export declare function useYExtremumGetter(): ExtremumGettersConfig<ChartSeriesType>;
