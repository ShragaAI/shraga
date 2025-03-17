import { AxisConfig } from '../../models';
import { FormattedSeries } from '../SeriesProvider';
import { ExtremumGettersConfig } from '../PluginProvider';
export declare const getAxisExtremum: (axis: AxisConfig, getters: ExtremumGettersConfig, axisIndex: number, formattedSeries: FormattedSeries) => number[];
