import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { ItemInteractionData } from '../context/InteractionProvider';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { ChartsTooltipClasses } from './chartsTooltipClasses';
export interface ChartsItemContentProps<T extends ChartSeriesType> {
    /**
     * The data used to identify the triggered item.
     */
    itemData: ItemInteractionData<T>;
    /**
     * The series linked to the triggered item.
     */
    series: ChartSeriesDefaultized<T>;
    /**
     * Override or extend the styles applied to the component.
     */
    classes: ChartsTooltipClasses;
    /**
     * Get the color of the item with index `dataIndex`.
     * @param {number} dataIndex The data index of the item.
     * @returns {string} The color to display.
     */
    getColor: (dataIndex: number) => string;
    sx?: SxProps<Theme>;
}
export interface ChartsItemTooltipContentProps<T extends ChartSeriesType> {
    itemData: ItemInteractionData<T>;
    content?: React.ElementType<ChartsItemContentProps<T>>;
    contentProps?: Partial<ChartsItemContentProps<T>>;
    sx?: SxProps<Theme>;
    classes: ChartsItemContentProps<T>['classes'];
}
/**
 * @ignore - internal component.
 */
declare function ChartsItemTooltipContent<T extends ChartSeriesType>(props: ChartsItemTooltipContentProps<T>): React.JSX.Element;
export { ChartsItemTooltipContent };
