import * as React from 'react';
import { ContinuousColorConfig } from '../../../models/colorMapping';
type ChartsContinuousGradientProps = {
    isReversed?: boolean;
    gradientId: string;
    size: number;
    direction: 'x' | 'y';
    scale: (value: any) => number | undefined;
    colorMap: ContinuousColorConfig;
    colorScale: (value: any) => string | null;
    /**
     * Defines the coordinate base to use:
     * - 'userSpaceOnUse': uses the coordinate of the SVG (values in px).
     * - 'objectBoundingBox': uses the coordinate ot the object on which gradient is applied (values from 0 to 1).
     */
    gradientUnits?: 'objectBoundingBox' | 'userSpaceOnUse';
};
export default function ChartsContinuousGradient(props: ChartsContinuousGradientProps): React.JSX.Element | null;
export {};
