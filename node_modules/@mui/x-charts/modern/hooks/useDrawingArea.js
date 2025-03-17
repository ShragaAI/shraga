'use client';

import * as React from 'react';
import { DrawingContext } from "../context/DrawingProvider.js";
export function useDrawingArea() {
  const {
    left,
    top,
    width,
    height,
    bottom,
    right,
    isPointInside
  } = React.useContext(DrawingContext);
  return React.useMemo(() => ({
    left,
    top,
    width,
    height,
    bottom,
    right,
    isPointInside
  }), [height, left, top, width, bottom, right, isPointInside]);
}