import * as React from 'react';
import { useTicks } from "../hooks/useTicks.js";
import { GridLine } from "./styledCommonents.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @ignore - internal component.
 */
export function ChartsGridVertical(props) {
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
  const xTicks = useTicks({
    scale,
    tickNumber,
    tickInterval
  });
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: xTicks.map(({
      value,
      offset
    }) => /*#__PURE__*/_jsx(GridLine, {
      y1: drawingArea.top,
      y2: drawingArea.top + drawingArea.height,
      x1: offset,
      x2: offset,
      className: classes.verticalLine
    }, `vertical-${value}`))
  });
}