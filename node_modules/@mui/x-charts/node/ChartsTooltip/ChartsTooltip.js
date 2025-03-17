"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsTooltip = ChartsTooltip;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _styles = require("@mui/material/styles");
var _Popper = _interopRequireDefault(require("@mui/material/Popper"));
var _NoSsr = _interopRequireDefault(require("@mui/material/NoSsr"));
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _InteractionProvider = require("../context/InteractionProvider");
var _utils = require("./utils");
var _ChartsItemTooltipContent = require("./ChartsItemTooltipContent");
var _ChartsAxisTooltipContent = require("./ChartsAxisTooltipContent");
var _chartsTooltipClasses = require("./chartsTooltipClasses");
var _jsxRuntime = require("react/jsx-runtime");
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell']
  };
  return (0, _composeClasses.default)(slots, _chartsTooltipClasses.getChartsTooltipUtilityClass, classes);
};
const ChartsTooltipRoot = (0, _styles.styled)(_Popper.default, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  theme
}) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal
}));

/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltip(inProps) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiChartsTooltip'
  });
  const {
    trigger = 'axis',
    itemContent,
    axisContent,
    slots,
    slotProps
  } = props;
  const mousePosition = (0, _utils.useMouseTracker)();
  const {
    item,
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const displayedData = trigger === 'item' ? item : axis;
  const tooltipHasData = (0, _utils.getTooltipHasData)(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;
  const classes = useUtilityClasses({
    classes: props.classes
  });
  const PopperComponent = slots?.popper ?? ChartsTooltipRoot;
  const popperProps = (0, _useSlotProps.default)({
    elementType: PopperComponent,
    externalSlotProps: slotProps?.popper,
    additionalProps: {
      open: popperOpen,
      placement: mousePosition?.pointerType === 'mouse' ? 'right-start' : 'top',
      anchorEl: (0, _utils.generateVirtualElement)(mousePosition),
      modifiers: [{
        name: 'offset',
        options: {
          offset: [0, mousePosition?.pointerType === 'touch' ? 40 - mousePosition.height : 0]
        }
      }]
    },
    ownerState: {}
  });
  if (trigger === 'none') {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_NoSsr.default, {
    children: popperOpen && /*#__PURE__*/(0, _jsxRuntime.jsx)(PopperComponent, (0, _extends2.default)({}, popperProps, {
      className: classes.root,
      children: trigger === 'item' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsItemTooltipContent.ChartsItemTooltipContent, {
        itemData: displayedData,
        content: slots?.itemContent ?? itemContent,
        contentProps: slotProps?.itemContent,
        sx: {
          mx: 2
        },
        classes: classes
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsAxisTooltipContent.ChartsAxisTooltipContent, {
        axisData: displayedData,
        content: slots?.axisContent ?? axisContent,
        contentProps: slotProps?.axisContent,
        sx: {
          mx: 2
        },
        classes: classes
      })
    }))
  });
}
process.env.NODE_ENV !== "production" ? ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when trigger is set to 'axis'.
   * @deprecated Use slots.axisContent instead
   */
  axisContent: _propTypes.default.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * Component to override the tooltip content when trigger is set to 'item'.
   * @deprecated Use slots.itemContent instead
   */
  itemContent: _propTypes.default.elementType,
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
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'axis'
   */
  trigger: _propTypes.default.oneOf(['axis', 'item', 'none'])
} : void 0;