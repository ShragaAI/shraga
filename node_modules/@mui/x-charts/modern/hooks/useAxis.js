'use client';

import { useCartesianContext } from "../context/CartesianProvider/index.js";
export function useXAxis(identifier) {
  const {
    xAxis,
    xAxisIds
  } = useCartesianContext();
  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];
  return xAxis[id];
}
export function useYAxis(identifier) {
  const {
    yAxis,
    yAxisIds
  } = useCartesianContext();
  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];
  return yAxis[id];
}