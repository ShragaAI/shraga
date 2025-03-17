"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircleMarkElement = CircleMarkElement;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _warning = require("@mui/x-internals/warning");
var _web = require("@react-spring/web");
var _InteractionProvider = require("../context/InteractionProvider");
var _useInteractionItemProps = require("../hooks/useInteractionItemProps");
var _context = require("../context");
var _markElementClasses = require("./markElementClasses");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["x", "y", "id", "classes", "color", "dataIndex", "onClick", "skipAnimation", "shape"];
/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
function CircleMarkElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color,
      dataIndex,
      onClick,
      skipAnimation,
      shape
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  if (shape !== 'circle') {
    (0, _warning.warnOnce)([`MUI X: The mark element of your line chart have shape "${shape}" which is not supported when using \`experimentalRendering=true\`.`, 'Only "circle" are supported with `experimentalRendering`.'].join('\n'), 'error');
  }
  const theme = (0, _styles.useTheme)();
  const getInteractionItemProps = (0, _useInteractionItemProps.useInteractionItemProps)();
  const {
    isFaded,
    isHighlighted
  } = (0, _context.useItemHighlighted)({
    seriesId: id
  });
  const {
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const position = (0, _web.useSpring)({
    to: {
      x,
      y
    },
    immediate: skipAnimation
  });
  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted: axis.x?.index === dataIndex || isHighlighted,
    isFaded,
    color
  };
  const classes = (0, _markElementClasses.useUtilityClasses)(ownerState);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_web.animated.circle, (0, _extends2.default)({}, other, {
    // @ts-expect-error
    cx: position.x,
    cy: position.y,
    r: 5,
    fill: (theme.vars || theme).palette.background.paper,
    stroke: color,
    strokeWidth: 2,
    className: classes.root,
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset'
  }, getInteractionItemProps({
    type: 'line',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? CircleMarkElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: _propTypes.default.number.isRequired,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * The shape of the marker.
   */
  shape: _propTypes.default.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: _propTypes.default.bool
} : void 0;