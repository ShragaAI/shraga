import { ChartsTextStyle } from '../ChartsText';
import { GetItemSpaceType, LegendItemParams, LegendItemWithPosition } from './chartsLegend.types';
export declare function legendItemPlacements(itemsToDisplay: LegendItemParams[], getItemSpace: GetItemSpaceType, labelStyle: ChartsTextStyle, direction: string, availableWidth: number, availableHeight: number, itemGap: number): [LegendItemWithPosition[], number, number];
