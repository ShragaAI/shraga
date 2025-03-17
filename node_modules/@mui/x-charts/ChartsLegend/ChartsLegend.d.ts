import * as React from 'react';
import { LegendRendererProps } from './DefaultChartsLegend';
import { LegendPlacement } from './legend.types';
export type ChartsLegendPropsBase = Omit<LegendRendererProps, keyof LegendPlacement | 'series' | 'seriesToDisplay' | 'drawingArea'> & LegendPlacement;
export interface ChartsLegendSlots {
    /**
     * Custom rendering of the legend.
     * @default DefaultChartsLegend
     */
    legend?: React.JSXElementConstructor<LegendRendererProps>;
}
export interface ChartsLegendSlotProps {
    legend?: Partial<LegendRendererProps>;
}
export interface ChartsLegendProps extends ChartsLegendPropsBase {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: ChartsLegendSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: ChartsLegendSlotProps;
}
declare function ChartsLegend(inProps: ChartsLegendProps): React.JSX.Element;
declare namespace ChartsLegend {
    var propTypes: any;
}
export { ChartsLegend };
