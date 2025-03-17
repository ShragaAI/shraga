"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsSurface = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _styles = require("@mui/material/styles");
var _propTypes = _interopRequireDefault(require("prop-types"));
var React = _interopRequireWildcard(require("react"));
var _useAxisEvents = require("../hooks/useAxisEvents");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["children", "width", "height", "viewBox", "disableAxisListener", "className", "title", "desc"];
const ChartChartsSurfaceStyles = (0, _styles.styled)('svg', {
  name: 'MuiChartsSurface',
  slot: 'Root'
})(() => ({
  // This prevents default touch actions when using the svg on mobile devices.
  // For example, prevent page scroll & zoom.
  touchAction: 'none'
}));
const ChartsSurface = exports.ChartsSurface = /*#__PURE__*/React.forwardRef(function ChartsSurface(inProps, ref) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiChartsSurface'
  });
  const {
      children,
      width,
      height,
      viewBox,
      disableAxisListener = false,
      className,
      title,
      desc
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const svgView = (0, _extends2.default)({
    width,
    height,
    x: 0,
    y: 0
  }, viewBox);
  (0, _useAxisEvents.useAxisEvents)(disableAxisListener);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(ChartChartsSurfaceStyles, (0, _extends2.default)({
    width: width,
    height: height,
    viewBox: `${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`,
    ref: ref,
    className: className
  }, other, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("title", {
      children: title
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("desc", {
      children: desc
    }), children]
  }));
});
process.env.NODE_ENV !== "production" ? ChartsSurface.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  desc: _propTypes.default.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: _propTypes.default.bool,
  /**
   * The height of the chart in px.
   */
  height: _propTypes.default.number.isRequired,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  title: _propTypes.default.string,
  viewBox: _propTypes.default.shape({
    height: _propTypes.default.number,
    width: _propTypes.default.number,
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  /**
   * The width of the chart in px.
   */
  width: _propTypes.default.number.isRequired
} : void 0;