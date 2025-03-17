"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsClipPath = ChartsClipPath;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useDrawingArea = require("../hooks/useDrawingArea");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * API:
 *
 * - [ChartsClipPath API](https://mui.com/x/api/charts/charts-clip-path/)
 */
function ChartsClipPath(props) {
  const {
    id,
    offset: offsetProps
  } = props;
  const {
    left,
    top,
    width,
    height
  } = (0, _useDrawingArea.useDrawingArea)();
  const offset = (0, _extends2.default)({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }, offsetProps);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("clipPath", {
    id: id,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
      x: left - offset.left,
      y: top - offset.top,
      width: width + offset.left + offset.right,
      height: height + offset.top + offset.bottom
    })
  });
}
process.env.NODE_ENV !== "production" ? ChartsClipPath.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  id: _propTypes.default.string.isRequired,
  offset: _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  })
} : void 0;