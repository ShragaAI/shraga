import * as React from 'react';
import { ColorLegendSelector, PiecewiseLabelFormatterParams } from './legend.types';
import { LegendPerItemProps } from './LegendPerItem';
import { PiecewiseColorLegendItemContext } from './chartsLegend.types';
export interface PiecewiseColorLegendProps extends ColorLegendSelector, Omit<LegendPerItemProps, 'itemsToDisplay' | 'onItemClick'> {
    /**
     * Hide the first item of the legend, corresponding to the [-infinity, min] piece.
     * @default false
     */
    hideFirst?: boolean;
    /**
     * Hide the last item of the legend, corresponding to the [max, +infinity] piece.
     * @default false
     */
    hideLast?: boolean;
    /**
     * Format the legend labels.
     * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
     * @returns {string|null} The displayed label, or `null` to skip the item.
     */
    labelFormatter?: (params: PiecewiseLabelFormatterParams) => string | null;
    /**
     * Callback fired when a legend item is clicked.
     * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
     * @param {PiecewiseColorLegendItemContext} legendItem The legend item data.
     * @param {number} index The index of the clicked legend item.
     */
    onItemClick?: (event: React.MouseEvent<SVGRectElement, MouseEvent>, legendItem: PiecewiseColorLegendItemContext, index: number) => void;
}
declare function PiecewiseColorLegend(props: PiecewiseColorLegendProps): React.JSX.Element | null;
declare namespace PiecewiseColorLegend {
    var propTypes: any;
}
export { PiecewiseColorLegend };
