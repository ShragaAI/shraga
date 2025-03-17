import { SeriesId } from '../models/seriesType/common';
export interface MarkElementClasses {
    /** Styles applied to the root element. */
    root: string;
    /** Styles applied to the root element when highlighted. */
    highlighted: string;
    /** Styles applied to the root element when faded. */
    faded: string;
}
export type MarkElementClassKey = keyof MarkElementClasses;
export interface MarkElementOwnerState {
    id: SeriesId;
    color: string;
    isFaded: boolean;
    isHighlighted: boolean;
    classes?: Partial<MarkElementClasses>;
}
export declare function getMarkElementUtilityClass(slot: string): string;
export declare const markElementClasses: MarkElementClasses;
export declare const useUtilityClasses: (ownerState: MarkElementOwnerState) => Record<"root", string>;
