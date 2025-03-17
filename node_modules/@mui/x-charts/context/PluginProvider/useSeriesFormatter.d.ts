import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesFormatterConfig } from './SeriesFormatter.types';
export declare function useSeriesFormatter<T extends ChartSeriesType>(seriesType: T): SeriesFormatterConfig<T>[T];
export declare function useSeriesFormatter(): SeriesFormatterConfig<ChartSeriesType>;
