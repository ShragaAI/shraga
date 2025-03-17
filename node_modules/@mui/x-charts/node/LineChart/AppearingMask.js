"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppearingMask = AppearingMask;
var React = _interopRequireWildcard(require("react"));
var _web = require("@react-spring/web");
var _cleanId = require("../internals/cleanId");
var _hooks = require("../hooks");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function AppearingMask(props) {
  const drawingArea = (0, _hooks.useDrawingArea)();
  const chartId = (0, _hooks.useChartId)();
  const transitionAppear = (0, _web.useTransition)([drawingArea], {
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
  const clipId = (0, _cleanId.cleanId)(`${chartId}-${props.id}`);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("clipPath", {
      id: clipId,
      children: transitionAppear(style => /*#__PURE__*/(0, _jsxRuntime.jsx)(_web.animated.rect, {
        // @ts-expect-error
        x: 0,
        y: 0,
        width: style.animatedWidth,
        height: drawingArea.top + drawingArea.height + drawingArea.bottom
      }))
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
      clipPath: `url(#${clipId})`,
      children: props.children
    })]
  });
}