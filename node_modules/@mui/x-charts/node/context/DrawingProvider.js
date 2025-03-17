"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DrawingContext = void 0;
exports.DrawingProvider = DrawingProvider;
exports.SvgContext = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useId = _interopRequireDefault(require("@mui/utils/useId"));
var _useChartDimensions = _interopRequireDefault(require("../hooks/useChartDimensions"));
var _jsxRuntime = require("react/jsx-runtime");
/**
 * Defines the area in which it is possible to draw the charts.
 */

const DrawingContext = exports.DrawingContext = /*#__PURE__*/React.createContext({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 300,
  width: 400,
  chartId: '',
  isPointInside: () => false
});
if (process.env.NODE_ENV !== 'production') {
  DrawingContext.displayName = 'DrawingContext';
}
const SvgContext = exports.SvgContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    current: null
  }
});
if (process.env.NODE_ENV !== 'production') {
  SvgContext.displayName = 'SvgContext';
}
function DrawingProvider(props) {
  const {
    width,
    height,
    margin,
    svgRef,
    children
  } = props;
  const drawingArea = (0, _useChartDimensions.default)(width, height, margin);
  const chartId = (0, _useId.default)();
  const isPointInside = React.useCallback(({
    x,
    y
  }, options) => {
    // For element allowed to overflow, wrapping them in <g data-drawing-container /> make them fully part of the drawing area.
    if (options?.targetElement && options?.targetElement.closest('[data-drawing-container]')) {
      return true;
    }
    const isInsideX = x >= drawingArea.left - 1 && x <= drawingArea.left + drawingArea.width;
    const isInsideY = y >= drawingArea.top - 1 && y <= drawingArea.top + drawingArea.height;
    if (options?.direction === 'x') {
      return isInsideX;
    }
    if (options?.direction === 'y') {
      return isInsideY;
    }
    return isInsideX && isInsideY;
  }, [drawingArea]);
  const value = React.useMemo(() => (0, _extends2.default)({
    chartId: chartId ?? ''
  }, drawingArea, {
    isPointInside
  }), [chartId, drawingArea, isPointInside]);
  const refValue = React.useMemo(() => ({
    isInitialized: true,
    data: svgRef
  }), [svgRef]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(SvgContext.Provider, {
    value: refValue,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(DrawingContext.Provider, {
      value: value,
      children: children
    })
  });
}