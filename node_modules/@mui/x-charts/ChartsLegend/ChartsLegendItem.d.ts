import * as React from 'react';
import { ChartsTextStyle } from '../ChartsText';
import { LegendItemParams } from './chartsLegend.types';
import { ChartsLegendClasses } from './chartsLegendClasses';
export interface ChartsLegendItemProps extends LegendItemParams {
    positionY: number;
    label: string;
    positionX: number;
    innerHeight: number;
    innerWidth: number;
    color: string;
    gapX: number;
    gapY: number;
    legendWidth: number;
    itemMarkHeight: number;
    itemMarkWidth: number;
    markGap: number;
    labelStyle: ChartsTextStyle;
    classes?: Omit<Partial<ChartsLegendClasses>, 'column' | 'row' | 'label'>;
    onClick?: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
}
/**
 * @ignore - internal component.
 */
declare function ChartsLegendItem(props: ChartsLegendItemProps): React.JSX.Element;
export { ChartsLegendItem };
