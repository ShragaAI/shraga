"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDrawingArea = useDrawingArea;
var React = _interopRequireWildcard(require("react"));
var _DrawingProvider = require("../context/DrawingProvider");
function useDrawingArea() {
  const {
    left,
    top,
    width,
    height,
    bottom,
    right,
    isPointInside
  } = React.useContext(_DrawingProvider.DrawingContext);
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