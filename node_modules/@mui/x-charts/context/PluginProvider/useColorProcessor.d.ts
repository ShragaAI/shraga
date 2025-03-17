import { ChartSeriesType } from '../../models/seriesType/config';
import { ColorProcessorsConfig } from './ColorProcessor.types';
export declare function useColorProcessor<T extends ChartSeriesType>(seriesType: T): ColorProcessorsConfig<T>[T];
export declare function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;
