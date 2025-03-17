import { ChartsAxisProps } from '../ChartsAxis';
import { ChartsAxisHighlightProps } from '../ChartsAxisHighlight';
import { ChartsGridProps } from '../ChartsGrid';
import { ChartsLegendProps } from '../ChartsLegend';
import { ChartsOverlayProps } from '../ChartsOverlay';
import { ChartsTooltipProps } from '../ChartsTooltip';
import type { ChartsVoronoiHandlerProps } from '../ChartsVoronoiHandler';
import { ResponsiveChartContainerProps } from '../ResponsiveChartContainer';
import { ZAxisContextProviderProps } from '../context';
import type { ScatterChartProps } from './ScatterChart';
import type { ScatterPlotProps } from './ScatterPlot';
/**
 * A helper function that extracts ScatterChartProps from the input props
 * and returns an object with props for the children components of ScatterChart.
 *
 * @param props The input props for ScatterChart
 * @returns An object with props for the children components of ScatterChart
 */
export declare const useScatterChartProps: (props: ScatterChartProps) => {
    chartContainerProps: ResponsiveChartContainerProps;
    zAxisProps: Omit<ZAxisContextProviderProps, "children">;
    voronoiHandlerProps: ChartsVoronoiHandlerProps;
    chartsAxisProps: ChartsAxisProps;
    gridProps: ChartsGridProps;
    scatterPlotProps: ScatterPlotProps;
    overlayProps: ChartsOverlayProps;
    legendProps: ChartsLegendProps;
    axisHighlightProps: ChartsAxisHighlightProps;
    tooltipProps: ChartsTooltipProps<"scatter">;
    children: import("react").ReactNode;
};
