import * as React from 'react';
import { MarkElementOwnerState } from './markElementClasses';
export type MarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> & Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
    /**
     * The shape of the marker.
     */
    shape: 'circle' | 'cross' | 'diamond' | 'square' | 'star' | 'triangle' | 'wye';
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
declare function MarkElement(props: MarkElementProps): React.JSX.Element;
declare namespace MarkElement {
    var propTypes: any;
}
export { MarkElement };
