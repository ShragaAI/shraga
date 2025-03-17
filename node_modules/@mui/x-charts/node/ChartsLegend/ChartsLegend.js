"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLegend = ChartsLegend;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _styles = require("@mui/material/styles");
var _utils = require("./utils");
var _chartsLegendClasses = require("./chartsLegendClasses");
var _DefaultChartsLegend = require("./DefaultChartsLegend");
var _hooks = require("../hooks");
var _useSeries = require("../hooks/useSeries");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps"];
const useUtilityClasses = ownerState => {
  const {
    classes,
    direction
  } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
    itemBackground: ['itemBackground']
  };
  return (0, _composeClasses.default)(slots, _chartsLegendClasses.getLegendUtilityClass, classes);
};
function ChartsLegend(inProps) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiChartsLegend'
  });
  const defaultizedProps = (0, _extends2.default)({
    direction: 'row'
  }, props, {
    position: (0, _extends2.default)({
      horizontal: 'middle',
      vertical: 'top'
    }, props.position)
  });
  const {
      slots,
      slotProps
    } = defaultizedProps,
    other = (0, _objectWithoutPropertiesLoose2.default)(defaultizedProps, _excluded);
  const theme = (0, _styles.useTheme)();
  const classes = useUtilityClasses((0, _extends2.default)({}, defaultizedProps, {
    theme
  }));
  const drawingArea = (0, _hooks.useDrawingArea)();
  const series = (0, _useSeries.useSeries)();
  const seriesToDisplay = (0, _utils.getSeriesToDisplay)(series);
  const ChartLegendRender = slots?.legend ?? _DefaultChartsLegend.DefaultChartsLegend;
  const chartLegendRenderProps = (0, _useSlotProps.default)({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: (0, _extends2.default)({}, other, {
      classes,
      drawingArea,
      series,
      seriesToDisplay
    }),
    ownerState: {}
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartLegendRender, (0, _extends2.default)({}, chartLegendRenderProps));
}
process.env.NODE_ENV !== "production" ? ChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: _propTypes.default.oneOf(['column', 'row']),
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: _propTypes.default.bool,
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap: _propTypes.default.number,
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight: _propTypes.default.number,
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth: _propTypes.default.number,
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: _propTypes.default.object,
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap: _propTypes.default.number,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: _propTypes.default.func,
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  })]),
  /**
   * The position of the legend.
   */
  position: _propTypes.default.shape({
    horizontal: _propTypes.default.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: _propTypes.default.oneOf(['bottom', 'middle', 'top']).isRequired
  }),
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