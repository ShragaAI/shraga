"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ChartsPiecewiseGradient;
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
function ChartsPiecewiseGradient(props) {
  const {
    isReversed,
    gradientId,
    size,
    direction,
    scale,
    colorMap
  } = props;
  if (size <= 0) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("linearGradient", {
    id: gradientId,
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "0",
    [`${direction}${isReversed ? 1 : 2}`]: `${size}px`,
    gradientUnits: "userSpaceOnUse" // Use the SVG coordinate instead of the component ones.
    ,
    children: colorMap.thresholds.map((threshold, index) => {
      const x = scale(threshold);
      if (x === undefined) {
        return null;
      }
      const offset = isReversed ? 1 - x / size : x / size;
      return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("stop", {
          offset: offset,
          stopColor: colorMap.colors[index],
          stopOpacity: 1
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("stop", {
          offset: offset,
          stopColor: colorMap.colors[index + 1],
          stopOpacity: 1
        })]
      }, threshold.toString() + index);
    })
  });
}