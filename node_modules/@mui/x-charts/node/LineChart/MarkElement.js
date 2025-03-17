"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MarkElement = MarkElement;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _web = require("@react-spring/web");
var _getSymbol = require("../internals/getSymbol");
var _InteractionProvider = require("../context/InteractionProvider");
var _useInteractionItemProps = require("../hooks/useInteractionItemProps");
var _context = require("../context");
var _markElementClasses = require("./markElementClasses");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["x", "y", "id", "classes", "color", "shape", "dataIndex", "onClick", "skipAnimation"];
const MarkElementPath = (0, _styles.styled)(_web.animated.path, {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState,
  theme
}) => ({
  fill: (theme.vars || theme).palette.background.paper,
  stroke: ownerState.color,
  strokeWidth: 2
}));
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
function MarkElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color,
      shape,
      dataIndex,
      onClick,
      skipAnimation
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(MarkElementPath, (0, _extends2.default)({}, other, {
    style: {
      transform: (0, _web.to)([position.x, position.y], (pX, pY) => `translate(${pX}px, ${pY}px)`),
      transformOrigin: (0, _web.to)([position.x, position.y], (pX, pY) => `${pX}px ${pY}px`)
    },
    ownerState: ownerState
    // @ts-expect-error
    ,
    className: classes.root,
    d: (0, _d3Shape.symbol)(_d3Shape.symbolsFill[(0, _getSymbol.getSymbol)(shape)])(),
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset'
  }, getInteractionItemProps({
    type: 'line',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? MarkElement.propTypes = {
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