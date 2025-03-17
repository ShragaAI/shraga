/**
 * Transform mouse event position to coordinates inside the SVG.
 * @param svg The SVG element
 * @param event The mouseEvent to transform
 */
export declare function getSVGPoint(svg: SVGSVGElement, event: Pick<MouseEvent, 'clientX' | 'clientY'>): DOMPoint;
