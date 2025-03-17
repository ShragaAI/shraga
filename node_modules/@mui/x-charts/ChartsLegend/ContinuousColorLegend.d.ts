import * as React from 'react';
import { ContinuousScaleName } from '../models/axis';
import { ChartsTextProps } from '../ChartsText';
import { ColorLegendSelector, LegendPlacement } from './legend.types';
type LabelFormatter = (params: {
    value: number | Date;
    formattedValue: string;
}) => string;
export interface ContinuousColorLegendProps extends LegendPlacement, ColorLegendSelector {
    /**
     * The label to display at the minimum side of the gradient.
     * Can either be a string, or a function.
     * @default ({ formattedValue }) => formattedValue
     */
    minLabel?: string | LabelFormatter;
    /**
     * The label to display at the maximum side of the gradient.
     * Can either be a string, or a function.
     * If not defined, the formatted maximal value is display.
     * @default ({ formattedValue }) => formattedValue
     */
    maxLabel?: string | LabelFormatter;
    /**
     * A unique identifier for the gradient.
     * @default auto-generated id
     */
    id?: string;
    /**
     * The scale used to display gradient colors.
     * @default 'linear'
     */
    scaleType?: ContinuousScaleName;
    /**
     * The length of the gradient bar.
     * Can be a number (in px) or a string with a percentage such as '50%'.
     * The '100%' is the length of the svg.
     * @default '50%'
     */
    length?: number | string;
    /**
     * The thickness of the gradient bar.
     * @default 5
     */
    thickness?: number;
    /**
     * The alignment of the texts with the gradient bar.
     * @default 'middle'
     */
    align?: 'start' | 'middle' | 'end';
    /**
     * The space between the gradient bar and the labels.
     * @default 4
     */
    spacing?: number;
    /**
     * The style applied to labels.
     * @default theme.typography.subtitle1
     */
    labelStyle?: ChartsTextProps['style'];
}
declare function ContinuousColorLegend(props: ContinuousColorLegendProps): React.JSX.Element | null;
declare namespace ContinuousColorLegend {
    var propTypes: any;
}
export { ContinuousColorLegend };
