import * as React from 'react';
import { SeriesId } from '../models/seriesType/common';
interface AppearingMaskProps {
    id: SeriesId;
    skipAnimation?: boolean;
    children: React.ReactNode;
}
/**
 * @ignore - internal component.
 */
export declare function AppearingMask(props: AppearingMaskProps): React.JSX.Element;
export {};
