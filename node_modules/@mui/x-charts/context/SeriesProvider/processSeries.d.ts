import { AllSeriesType } from '../../models/seriesType';
import { ChartSeriesType, DatasetType } from '../../models/seriesType/config';
import { FormattedSeries } from './Series.types';
import { SeriesFormatterConfig } from '../PluginProvider';
/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
export declare const preprocessSeries: <T extends ChartSeriesType>({ series, colors, seriesFormatters, dataset, }: {
    series: AllSeriesType<T>[];
    colors: string[];
    seriesFormatters: SeriesFormatterConfig<T>;
    dataset?: DatasetType;
}) => FormattedSeries;
