/**
 * Applies the zoom into the scale range.
 * It changes the screen coordinates that the scale covers.
 * Not the data that is displayed.
 *
 * @param scaleRange the original range in real screen coordinates.
 * @param zoomRange the zoom range in percentage.
 * @returns zoomed range in real screen coordinates.
 */
export declare const zoomScaleRange: (scaleRange: [number, number] | number[], zoomRange: [number, number] | number[]) => number[];
