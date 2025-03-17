"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarClipPath = BarClipPath;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _web = require("@react-spring/web");
var _getRadius = require("./getRadius");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["style", "maskId"];
const buildInset = corners => `inset(0px round ${corners.topLeft}px ${corners.topRight}px ${corners.bottomRight}px ${corners.bottomLeft}px)`;
function BarClipRect(props) {
  const radiusData = props.ownerState;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_web.animated.rect, {
    style: (0, _extends2.default)({}, props.style, {
      clipPath: (props.ownerState.layout === 'vertical' ? props.style?.height : props.style?.width).to(value => buildInset({
        topLeft: Math.min(value, (0, _getRadius.getRadius)('top-left', radiusData)),
        topRight: Math.min(value, (0, _getRadius.getRadius)('top-right', radiusData)),
        bottomRight: Math.min(value, (0, _getRadius.getRadius)('bottom-right', radiusData)),
        bottomLeft: Math.min(value, (0, _getRadius.getRadius)('bottom-left', radiusData))
      }))
    })
  });
}
/**
 * @ignore - internal component.
 */
function BarClipPath(props) {
  const {
      style,
      maskId
    } = props,
    rest = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  if (!props.borderRadius || props.borderRadius <= 0) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("clipPath", {
    id: maskId,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(BarClipRect, {
      ownerState: rest,
      style: style
    })
  });
}