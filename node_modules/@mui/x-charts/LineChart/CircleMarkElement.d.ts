import * as React from 'react';
import { MarkElementOwnerState } from './markElementClasses';
export type CircleMarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> & Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
};
/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
declare function CircleMarkElement(props: CircleMarkElementProps): React.JSX.Element;
declare namespace CircleMarkElement {
    var propTypes: any;
}
export { CircleMarkElement };
