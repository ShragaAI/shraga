"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLegendItem = ChartsLegendItem;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _clsx = _interopRequireDefault(require("clsx"));
var _RtlProvider = require("@mui/system/RtlProvider");
var _ChartsText = require("../ChartsText");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props) {
  const isRTL = (0, _RtlProvider.useRtl)();
  const {
    id,
    positionY,
    label,
    positionX,
    innerHeight,
    innerWidth,
    legendWidth,
    color,
    gapX,
    gapY,
    itemMarkHeight,
    itemMarkWidth,
    markGap,
    labelStyle,
    classes,
    onClick
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", {
    className: (0, _clsx.default)(classes?.series, `${classes?.series}-${id}`),
    transform: `translate(${gapX + (isRTL ? legendWidth - positionX : positionX)} ${gapY + positionY})`,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
      x: isRTL ? -(innerWidth + 2) : -2,
      y: -itemMarkHeight / 2 - 2,
      width: innerWidth + 4,
      height: innerHeight + 4,
      fill: "transparent",
      className: classes?.itemBackground,
      onClick: onClick,
      style: {
        pointerEvents: onClick ? 'all' : 'none',
        cursor: onClick ? 'pointer' : 'unset'
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
      className: classes?.mark,
      x: isRTL ? -itemMarkWidth : 0,
      y: -itemMarkHeight / 2,
      width: itemMarkWidth,
      height: itemMarkHeight,
      fill: color,
      style: {
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsText.ChartsText, {
      style: (0, _extends2.default)({
        pointerEvents: 'none'
      }, labelStyle),
      text: label,
      x: (isRTL ? -1 : 1) * (itemMarkWidth + markGap),
      y: 0
    })]
  });
}