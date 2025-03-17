'use client';

import * as React from 'react';
import { animated, useTransition } from '@react-spring/web';
import { cleanId } from "../internals/cleanId.js";
import { useChartId, useDrawingArea } from "../hooks/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @ignore - internal component.
 */
export function AppearingMask(props) {
  const drawingArea = useDrawingArea();
  const chartId = useChartId();
  const transitionAppear = useTransition([drawingArea], {
    from: v => ({
      animatedWidth: v.left
    }),
    enter: v => ({
      animatedWidth: v.width + v.left + v.right
    }),
    leave: v => ({
      animatedWidth: v.width + v.left + v.right
    }),
    reset: false,
    immediate: props.skipAnimation
  });
  const clipId = cleanId(`${chartId}-${props.id}`);
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [/*#__PURE__*/_jsx("clipPath", {
      id: clipId,
      children: transitionAppear(style => /*#__PURE__*/_jsx(animated.rect, {
        // @ts-expect-error
        x: 0,
        y: 0,
        width: style.animatedWidth,
        height: drawingArea.top + drawingArea.height + drawingArea.bottom
      }))
    }), /*#__PURE__*/_jsx("g", {
      clipPath: `url(#${clipId})`,
      children: props.children
    })]
  });
}