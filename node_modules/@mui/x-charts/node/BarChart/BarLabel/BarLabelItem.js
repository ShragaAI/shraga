"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarLabelItem = BarLabelItem;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _useSlotProps2 = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _barLabelClasses = require("./barLabelClasses");
var _getBarLabel = require("./getBarLabel");
var _BarLabel = require("./BarLabel");
var _context = require("../../context");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["seriesId", "classes", "color", "style", "dataIndex", "barLabel", "slots", "slotProps", "height", "width", "value"],
  _excluded2 = ["ownerState"];
/**
 * @ignore - internal component.
 */
function BarLabelItem(props) {
  const {
      seriesId,
      classes: innerClasses,
      color,
      style,
      dataIndex,
      barLabel,
      slots,
      slotProps,
      height,
      width,
      value
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const {
    isFaded,
    isHighlighted
  } = (0, _context.useItemHighlighted)({
    seriesId,
    dataIndex
  });
  const ownerState = {
    seriesId,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    dataIndex
  };
  const classes = (0, _barLabelClasses.useUtilityClasses)(ownerState);
  const Component = slots?.barLabel ?? _BarLabel.BarLabel;
  const _useSlotProps = (0, _useSlotProps2.default)({
      elementType: Component,
      externalSlotProps: slotProps?.barLabel,
      additionalProps: (0, _extends2.default)({}, other, {
        style,
        className: classes.root
      }),
      ownerState
    }),
    {
      ownerState: barLabelOwnerState
    } = _useSlotProps,
    barLabelProps = (0, _objectWithoutPropertiesLoose2.default)(_useSlotProps, _excluded2);
  if (!barLabel) {
    return null;
  }
  const formattedLabelText = (0, _getBarLabel.getBarLabel)({
    barLabel,
    value,
    dataIndex,
    seriesId,
    height,
    width
  });
  if (!formattedLabelText) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, (0, _extends2.default)({}, barLabelProps, barLabelOwnerState, {
    children: formattedLabelText
  }));
}
process.env.NODE_ENV !== "production" ? BarLabelItem.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel: _propTypes.default.oneOfType([_propTypes.default.oneOf(['value']), _propTypes.default.func]),
  classes: _propTypes.default.object,
  color: _propTypes.default.string.isRequired,
  dataIndex: _propTypes.default.number.isRequired,
  /**
   * The height of the bar.
   */
  height: _propTypes.default.number.isRequired,
  seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object,
  /**
   * The value of the data point.
   */
  value: _propTypes.default.number,
  /**
   * The width of the bar.
   */
  width: _propTypes.default.number.isRequired
} : void 0;