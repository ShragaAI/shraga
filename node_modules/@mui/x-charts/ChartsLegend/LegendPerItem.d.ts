import * as React from 'react';
import { DrawingArea } from '../context/DrawingProvider';
import { ChartsTextStyle } from '../ChartsText';
import { CardinalDirections } from '../models/layout';
import { LegendItemParams } from './chartsLegend.types';
import { AnchorPosition, Direction, LegendPlacement } from './legend.types';
import { ChartsLegendClasses } from './chartsLegendClasses';
import { DefaultizedProps } from '../models/helpers';
export type ChartsLegendRootOwnerState = {
    position: AnchorPosition;
    direction: Direction;
    drawingArea: DrawingArea;
    offsetX?: number;
    offsetY?: number;
    seriesNumber: number;
};
export declare const ChartsLegendRoot: import("@emotion/styled").StyledComponent<import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>, Pick<React.SVGProps<SVGGElement>, keyof React.SVGProps<SVGGElement>>, {}>;
export interface LegendPerItemProps extends DefaultizedProps<LegendPlacement, keyof LegendPlacement> {
    /**
     * The ordered array of item to display in the legend.
     */
    itemsToDisplay: LegendItemParams[];
    /**
     * Override or extend the styles applied to the component.
     */
    classes?: Partial<ChartsLegendClasses>;
    /**
     * Style applied to legend labels.
     * @default theme.typography.subtitle1
     */
    labelStyle?: ChartsTextStyle;
    /**
     * Width of the item mark (in px).
     * @default 20
     */
    itemMarkWidth?: number;
    /**
     * Height of the item mark (in px).
     * @default 20
     */
    itemMarkHeight?: number;
    /**
     * Space between the mark and the label (in px).
     * @default 5
     */
    markGap?: number;
    /**
     * Space between two legend items (in px).
     * @default 10
     */
    itemGap?: number;
    /**
     * Legend padding (in px).
     * Can either be a single number, or an object with top, left, bottom, right properties.
     * @default 10
     */
    padding?: number | Partial<CardinalDirections<number>>;
    onItemClick?: (event: React.MouseEvent<SVGRectElement, MouseEvent>, index: number) => void;
}
/**
 * Internal component to display an array of items as a legend.
 * Used for series legend, and threshold color legend.
 * @ignore - Do not document
 */
export declare function LegendPerItem(props: LegendPerItemProps): React.JSX.Element;
