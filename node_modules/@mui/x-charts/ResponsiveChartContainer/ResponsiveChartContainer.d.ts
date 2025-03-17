import * as React from 'react';
import { ChartContainerProps } from '../ChartContainer';
export interface ResponsiveChartContainerProps extends Omit<ChartContainerProps, 'width' | 'height'> {
    /**
     * The width of the chart in px. If not defined, it takes the width of the parent element.
     */
    width?: number;
    /**
     * The height of the chart in px. If not defined, it takes the height of the parent element.
     */
    height?: number;
    /**
     * The chart will try to wait for the parent container to resolve its size
     * before it renders for the first time.
     *
     * This can be useful in some scenarios where the chart appear to grow after
     * the first render, like when used inside a grid.
     *
     * @default false
     */
    resolveSizeBeforeRender?: boolean;
}
declare const ResponsiveChartContainer: React.ForwardRefExoticComponent<ResponsiveChartContainerProps & React.RefAttributes<unknown>>;
export { ResponsiveChartContainer };
