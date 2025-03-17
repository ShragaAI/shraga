import { AxisConfig } from '../../models';
import { FormattedSeries } from '../SeriesProvider';
import { ExtremumGettersConfig } from '../PluginProvider';
import { GetZoomAxisFilters } from './Cartesian.types';
export declare const getAxisExtremum: (axis: AxisConfig, getters: ExtremumGettersConfig, axisIndex: number, formattedSeries: FormattedSeries, getFilters?: GetZoomAxisFilters) => number[];
