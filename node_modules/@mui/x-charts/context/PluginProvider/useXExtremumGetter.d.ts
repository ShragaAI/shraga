import { ChartSeriesType } from '../../models/seriesType/config';
import { ExtremumGettersConfig } from './ExtremumGetter.types';
export declare function useXExtremumGetter<T extends ChartSeriesType>(seriesType: T): ExtremumGettersConfig<T>[T];
export declare function useXExtremumGetter(): ExtremumGettersConfig<ChartSeriesType>;
