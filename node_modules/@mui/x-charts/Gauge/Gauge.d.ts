import * as React from 'react';
import { GaugeContainerProps } from './GaugeContainer';
import { GaugeClasses } from './gaugeClasses';
import { GaugeValueTextProps } from './GaugeValueText';
export interface GaugeProps extends GaugeContainerProps, Pick<GaugeValueTextProps, 'text'> {
    classes?: Partial<GaugeClasses>;
    children?: React.ReactNode;
}
declare const Gauge: React.ForwardRefExoticComponent<GaugeProps & React.RefAttributes<unknown>>;
export { Gauge };
