import { ChartSeriesType } from '../../models/seriesType/config';
import { ExtremumGettersConfig } from './ExtremumGetter.types';
export declare function useRadiusExtremumGetter<T extends ChartSeriesType>(seriesType: T): ExtremumGettersConfig<T>[T];
export declare function useRadiusExtremumGetter(): ExtremumGettersConfig<ChartSeriesType>;
