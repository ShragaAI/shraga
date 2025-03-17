'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import composeClasses from '@mui/utils/composeClasses';
import { warnOnce } from '@mui/x-internals/warning';
import { useDrawingArea, useYScale } from "../hooks/index.js";
import { ReferenceLineRoot } from "./common.js";
import { ChartsText } from "../ChartsText/index.js";
import { getReferenceLineUtilityClass } from "./chartsReferenceLineClasses.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const getTextParams = ({
  left,
  width,
  spacingX,
  labelAlign = 'middle'
}) => {
  switch (labelAlign) {
    case 'start':
      return {
        x: left + spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'start'
        }
      };
    case 'end':
      return {
        x: left + width - spacingX,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'end'
        }
      };
    default:
      return {
        x: left + width / 2,
        style: {
          dominantBaseline: 'auto',
          textAnchor: 'middle'
        }
      };
  }
};
export function getYReferenceLineClasses(classes) {
  return composeClasses({
    root: ['root', 'horizontal'],
    line: ['line'],
    label: ['label']
  }, getReferenceLineUtilityClass, classes);
}
function ChartsYReferenceLine(props) {
  const {
    y,
    label = '',
    spacing = 5,
    classes: inClasses,
    labelAlign,
    lineStyle,
    labelStyle,
    axisId
  } = props;
  const {
    left,
    width
  } = useDrawingArea();
  const yAxisScale = useYScale(axisId);
  const yPosition = yAxisScale(y);
  if (yPosition === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      warnOnce(`MUI X: the value ${y} does not exist in the data of y axis with id ${axisId}.`, 'error');
    }
    return null;
  }
  const d = `M ${left} ${yPosition} l ${width} 0`;
  const classes = getYReferenceLineClasses(inClasses);
  const spacingX = typeof spacing === 'object' ? spacing.x ?? 0 : spacing;
  const spacingY = typeof spacing === 'object' ? spacing.y ?? 0 : spacing;
  const textParams = _extends({
    y: yPosition - spacingY,
    text: label,
    fontSize: 12
  }, getTextParams({
    left,
    width,
    spacingX,
    labelAlign
  }), {
    className: classes.label
  });
  return /*#__PURE__*/_jsxs(ReferenceLineRoot, {
    className: classes.root,
    children: [/*#__PURE__*/_jsx("path", {
      d: d,
      className: classes.line,
      style: lineStyle
    }), /*#__PURE__*/_jsx(ChartsText, _extends({}, textParams, {
      style: _extends({}, textParams.style, labelStyle)
    }))]
  });
}
export { ChartsYReferenceLine };