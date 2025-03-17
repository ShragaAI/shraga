import * as React from 'react';
import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesProviderProps } from './Series.types';
declare function SeriesProvider<T extends ChartSeriesType>(props: SeriesProviderProps<T>): React.JSX.Element;
export { SeriesProvider };
