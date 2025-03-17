"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _constants = require("../constants");
const useChartDimensions = (width, height, margin) => {
  const defaultizedMargin = (0, _extends2.default)({}, _constants.DEFAULT_MARGINS, margin);
  const drawingArea = React.useMemo(() => ({
    left: defaultizedMargin.left,
    top: defaultizedMargin.top,
    right: defaultizedMargin.right,
    bottom: defaultizedMargin.bottom,
    width: Math.max(0, width - defaultizedMargin.left - defaultizedMargin.right),
    height: Math.max(0, height - defaultizedMargin.top - defaultizedMargin.bottom)
  }), [width, height, defaultizedMargin.top, defaultizedMargin.bottom, defaultizedMargin.left, defaultizedMargin.right]);
  return drawingArea;
};
var _default = exports.default = useChartDimensions;