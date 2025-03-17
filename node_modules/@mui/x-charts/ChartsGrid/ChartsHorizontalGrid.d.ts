import * as React from 'react';
import { DrawingArea } from '../context/DrawingProvider';
import { AxisDefaultized, ChartsYAxisProps, ScaleName } from '../models/axis';
import { ChartsGridClasses } from './chartsGridClasses';
interface ChartsGridHorizontalProps {
    axis: AxisDefaultized<ScaleName, any, ChartsYAxisProps>;
    drawingArea: DrawingArea;
    classes: Partial<ChartsGridClasses>;
}
/**
 * @ignore - internal component.
 */
export declare function ChartsGridHorizontal(props: ChartsGridHorizontalProps): React.JSX.Element;
export {};
