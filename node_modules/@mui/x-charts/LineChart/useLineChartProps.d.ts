import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsClipPathProps } from '../ChartsClipPath';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsOnAxisClickHandlerProps } from '../ChartsOnAxisClickHandler';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsTooltipProps } from '../ChartsTooltip';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { AreaPlotProps } from './AreaPlot';
import type { LineChartProps } from './LineChart';
import { LineHighlightPlotProps } from './LineHighlightPlot';
import { LinePlotProps } from './LinePlot';
import { MarkPlotProps } from './MarkPlot';
/**
 * A helper function that extracts LineChartProps from the input props
 * and returns an object with props for the children components of LineChart.
 *
 * @param props The input props for LineChart
 * @returns An object with props for the children components of LineChart
 */
export declare const useLineChartProps: (props: LineChartProps) => {
    chartContainerProps: ResponsiveChartContainerProps;
    axisClickHandlerProps: ChartsOnAxisClickHandlerProps;
    gridProps: ChartsGridProps;
    clipPathProps: ChartsClipPathProps;
    clipPathGroupProps: {
        clipPath: string;
    };
    areaPlotProps: AreaPlotProps;
    linePlotProps: LinePlotProps;
    markPlotProps: MarkPlotProps;
    overlayProps: ChartsOverlayProps;
    chartsAxisProps: ChartsAxisProps;
    axisHighlightProps: ChartsAxisHighlightProps;
    lineHighlightPlotProps: LineHighlightPlotProps;
    legendProps: ChartsLegendProps;
    tooltipProps: ChartsTooltipProps<"line">;
    children: import("react").ReactNode;
};
