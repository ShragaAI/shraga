import * as React from 'react';
import { SeriesItemIdentifier } from '../models';
export declare const useInteractionItemProps: (skip?: boolean) => (() => {}) | ((data: SeriesItemIdentifier) => {
    onPointerEnter: () => void;
    onPointerLeave: (event: React.PointerEvent) => void;
    onPointerDown: (event: React.PointerEvent) => void;
});
