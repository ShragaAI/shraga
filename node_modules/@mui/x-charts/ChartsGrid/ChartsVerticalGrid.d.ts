import * as React from 'react';
import { DrawingArea } from '../context/DrawingProvider';
import { AxisDefaultized, ChartsXAxisProps, ScaleName } from '../models/axis';
import { ChartsGridClasses } from './chartsGridClasses';
interface ChartsGridVerticalProps {
    axis: AxisDefaultized<ScaleName, any, ChartsXAxisProps>;
    drawingArea: DrawingArea;
    classes: Partial<ChartsGridClasses>;
}
/**
 * @ignore - internal component.
 */
export declare function ChartsGridVertical(props: ChartsGridVerticalProps): React.JSX.Element;
export {};
