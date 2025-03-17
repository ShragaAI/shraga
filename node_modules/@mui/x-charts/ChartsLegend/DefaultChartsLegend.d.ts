import * as React from 'react';
import { FormattedSeries } from '../context/SeriesProvider';
import { LegendPerItemProps } from './LegendPerItem';
import { DrawingArea } from '../context/DrawingProvider';
import { SeriesLegendItemContext } from './chartsLegend.types';
export interface LegendRendererProps extends Omit<LegendPerItemProps, 'itemsToDisplay' | 'onItemClick'> {
    series: FormattedSeries;
    seriesToDisplay: LegendPerItemProps['itemsToDisplay'];
    /**
     * @deprecated Use the `useDrawingArea` hook instead.
     */
    drawingArea: Omit<DrawingArea, 'isPointInside'>;
    /**
     * Callback fired when a legend item is clicked.
     * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
     * @param {SeriesLegendItemContext} legendItem The legend item data.
     * @param {number} index The index of the clicked legend item.
     */
    onItemClick?: (event: React.MouseEvent<SVGRectElement, MouseEvent>, legendItem: SeriesLegendItemContext, index: number) => void;
    /**
     * Set to true to hide the legend.
     * @default false
     */
    hidden?: boolean;
}
declare function DefaultChartsLegend(props: LegendRendererProps): React.JSX.Element | null;
declare namespace DefaultChartsLegend {
    var propTypes: any;
}
export { DefaultChartsLegend };
