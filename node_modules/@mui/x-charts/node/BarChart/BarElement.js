"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarElement = BarElement;
exports.barElementClasses = exports.BarElementPath = void 0;
exports.getBarElementUtilityClass = getBarElementUtilityClass;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _styles = require("@mui/material/styles");
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _d3Color = require("@mui/x-charts-vendor/d3-color");
var _web = require("@react-spring/web");
var _useInteractionItemProps = require("../hooks/useInteractionItemProps");
var _context = require("../context");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["id", "dataIndex", "classes", "color", "slots", "slotProps", "style", "onClick"];
function getBarElementUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiBarElement', slot);
}
const barElementClasses = exports.barElementClasses = (0, _generateUtilityClasses.default)('MuiBarElement', ['root']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`]
  };
  return (0, _composeClasses.default)(slots, getBarElementUtilityClass, classes);
};
const BarElementPath = exports.BarElementPath = (0, _styles.styled)(_web.animated.rect, {
  name: 'MuiBarElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState
}) => ({
  stroke: 'none',
  fill: ownerState.isHighlighted ? (0, _d3Color.color)(ownerState.color).brighter(0.5).formatHex() : ownerState.color,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  opacity: ownerState.isFaded && 0.3 || 1
}));
function BarElement(props) {
  const {
      id,
      dataIndex,
      classes: innerClasses,
      color,
      slots,
      slotProps,
      style,
      onClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const getInteractionItemProps = (0, _useInteractionItemProps.useInteractionItemProps)();
  const {
    isFaded,
    isHighlighted
  } = (0, _context.useItemHighlighted)({
    seriesId: id,
    dataIndex
  });
  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted
  };
  const classes = useUtilityClasses(ownerState);
  const Bar = slots?.bar ?? BarElementPath;
  const barProps = (0, _useSlotProps.default)({
    elementType: Bar,
    externalSlotProps: slotProps?.bar,
    externalForwardedProps: other,
    additionalProps: (0, _extends2.default)({}, getInteractionItemProps({
      type: 'bar',
      seriesId: id,
      dataIndex
    }), {
      style,
      onClick,
      cursor: onClick ? 'pointer' : 'unset'
    }),
    className: classes.root,
    ownerState
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Bar, (0, _extends2.default)({}, barProps));
}
process.env.NODE_ENV !== "production" ? BarElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  dataIndex: _propTypes.default.number.isRequired,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object
} : void 0;