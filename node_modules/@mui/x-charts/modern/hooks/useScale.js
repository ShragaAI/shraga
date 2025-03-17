'use client';

import { isBandScale } from "../internals/isBandScale.js";
import { useXAxis, useYAxis } from "./useAxis.js";

/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param scale The scale to use
 * @returns (value: any) => number
 */
export function getValueToPositionMapper(scale) {
  if (isBandScale(scale)) {
    return value => (scale(value) ?? 0) + scale.bandwidth() / 2;
  }
  return value => scale(value);
}
export function useXScale(identifier) {
  const axis = useXAxis(identifier);
  return axis.scale;
}
export function useYScale(identifier) {
  const axis = useYAxis(identifier);
  return axis.scale;
}