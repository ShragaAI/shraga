import * as React from 'react';
import { useTicks } from "../hooks/useTicks.js";
import { GridLine } from "./styledCommonents.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @ignore - internal component.
 */
export function ChartsGridHorizontal(props) {
  const {
    axis,
    drawingArea,
    classes
  } = props;
  const {
    scale,
    tickNumber,
    tickInterval
  } = axis;
  const yTicks = useTicks({
    scale,
    tickNumber,
    tickInterval
  });
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: yTicks.map(({
      value,
      offset
    }) => /*#__PURE__*/_jsx(GridLine, {
      y1: offset,
      y2: offset,
      x1: drawingArea.left,
      x2: drawingArea.left + drawingArea.width,
      className: classes.horizontalLine
    }, `horizontal-${value}`))
  });
}