import * as React from 'react';
import { LineItemIdentifier } from '../models/seriesType/line';
import { MarkElementProps } from './MarkElement';
export interface MarkPlotSlots {
    mark?: React.JSXElementConstructor<MarkElementProps>;
}
export interface MarkPlotSlotProps {
    mark?: Partial<MarkElementProps>;
}
export interface MarkPlotProps extends React.SVGAttributes<SVGSVGElement>, Pick<MarkElementProps, 'skipAnimation'> {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: MarkPlotSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: MarkPlotSlotProps;
    /**
     * Callback fired when a line mark item is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
     */
    onItemClick?: (event: React.MouseEvent<SVGElement, MouseEvent>, lineItemIdentifier: LineItemIdentifier) => void;
    /**
     * If `true` the mark element will only be able to render circle.
     * Giving fewer customization options, but saving around 40ms per 1.000 marks.
     * @default false
     */
    experimentalRendering?: boolean;
}
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
declare function MarkPlot(props: MarkPlotProps): React.JSX.Element | null;
declare namespace MarkPlot {
    var propTypes: any;
}
export { MarkPlot };
