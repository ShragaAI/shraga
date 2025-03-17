"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimatedArea = AnimatedArea;
exports.AreaElementPath = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _web = require("@react-spring/web");
var _d3Color = require("@mui/x-charts-vendor/d3-color");
var _useStringInterpolator = require("../internals/useStringInterpolator");
var _AppearingMask = require("./AppearingMask");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["d", "skipAnimation", "ownerState"];
const AreaElementPath = exports.AreaElementPath = (0, _styles.styled)(_web.animated.path, {
  name: 'MuiAreaElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState
}) => ({
  stroke: 'none',
  fill: ownerState.gradientId && `url(#${ownerState.gradientId})` || ownerState.isHighlighted && (0, _d3Color.color)(ownerState.color).brighter(1).formatHex() || (0, _d3Color.color)(ownerState.color).brighter(0.5).formatHex(),
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1
}));
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/animated-area/)
 */
function AnimatedArea(props) {
  const {
      d,
      skipAnimation,
      ownerState
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const stringInterpolator = (0, _useStringInterpolator.useStringInterpolator)(d);
  const transitionChange = (0, _web.useTransition)([stringInterpolator], {
    from: {
      value: 0
    },
    to: {
      value: 1
    },
    enter: {
      value: 1
    },
    reset: false,
    immediate: skipAnimation
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_AppearingMask.AppearingMask, {
    skipAnimation: skipAnimation,
    id: `${ownerState.id}-area-clip`,
    children: transitionChange((style, interpolator) =>
    /*#__PURE__*/
    // @ts-expect-error
    (0, _jsxRuntime.jsx)(AreaElementPath, (0, _extends2.default)({}, other, {
      ownerState: ownerState,
      d: style.value.to(interpolator)
    })))
  });
}
process.env.NODE_ENV !== "production" ? AnimatedArea.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  d: _propTypes.default.string.isRequired,
  ownerState: _propTypes.default.shape({
    classes: _propTypes.default.object,
    color: _propTypes.default.string.isRequired,
    gradientId: _propTypes.default.string,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
    isFaded: _propTypes.default.bool.isRequired,
    isHighlighted: _propTypes.default.bool.isRequired
  }).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: _propTypes.default.bool
} : void 0;