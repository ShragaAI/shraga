import type { BarChartProps } from './BarChart';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { BarPlotProps } from './BarPlot';
import { ChartsOnAxisClickHandlerProps } from '../ChartsOnAxisClickHandler';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsTooltipProps } from '../ChartsTooltip';
/**
 * A helper function that extracts BarChartProps from the input props
 * and returns an object with props for the children components of BarChart.
 *
 * @param props The input props for BarChart
 * @returns An object with props for the children components of BarChart
 */
export declare const useBarChartProps: (props: BarChartProps) => {
    chartContainerProps: ResponsiveChartContainerProps;
    barPlotProps: BarPlotProps;
    axisClickHandlerProps: ChartsOnAxisClickHandlerProps;
    gridProps: ChartsGridProps;
    clipPathProps: ChartsClipPathProps;
    clipPathGroupProps: {
        clipPath: string;
    };
    overlayProps: ChartsOverlayProps;
    chartsAxisProps: ChartsAxisProps;
    axisHighlightProps: ChartsAxisHighlightProps;
    legendProps: ChartsLegendProps;
    tooltipProps: ChartsTooltipProps<"bar">;
    children: import("react").ReactNode;
};
