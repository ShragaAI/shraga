"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarLabelPlot = BarLabelPlot;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _web = require("@react-spring/web");
var _BarLabelItem = require("./BarLabelItem");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["bars", "skipAnimation"];
const leaveStyle = ({
  layout,
  yOrigin,
  x,
  width,
  y,
  xOrigin,
  height
}) => (0, _extends2.default)({}, layout === 'vertical' ? {
  y: yOrigin,
  x: x + width / 2,
  height: 0,
  width
} : {
  y: y + height / 2,
  x: xOrigin,
  height,
  width: 0
});
const enterStyle = ({
  x,
  width,
  y,
  height
}) => ({
  x: x + width / 2,
  y: y + height / 2,
  height,
  width
});
/**
 * @ignore - internal component.
 */
function BarLabelPlot(props) {
  const {
      bars,
      skipAnimation
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const barLabelTransition = (0, _web.useTransition)(bars, {
    keys: bar => `${bar.seriesId}-${bar.dataIndex}`,
    from: leaveStyle,
    leave: null,
    enter: enterStyle,
    update: enterStyle,
    immediate: skipAnimation
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
    children: barLabelTransition((style, {
      seriesId,
      dataIndex,
      color,
      value,
      width,
      height
    }) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_BarLabelItem.BarLabelItem, (0, _extends2.default)({
      seriesId: seriesId,
      dataIndex: dataIndex,
      value: value,
      color: color,
      width: width,
      height: height
    }, other, {
      style: style
    })))
  });
}