"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultChartsLegend = DefaultChartsLegend;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _LegendPerItem = require("./LegendPerItem");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["drawingArea", "seriesToDisplay", "hidden", "onItemClick"];
const seriesContextBuilder = context => ({
  type: 'series',
  color: context.color,
  label: context.label,
  seriesId: context.seriesId,
  itemId: context.itemId
});
function DefaultChartsLegend(props) {
  const {
      seriesToDisplay,
      hidden,
      onItemClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  if (hidden) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_LegendPerItem.LegendPerItem, (0, _extends2.default)({}, other, {
    itemsToDisplay: seriesToDisplay,
    onItemClick: onItemClick ? (event, i) => onItemClick(event, seriesContextBuilder(seriesToDisplay[i]), i) : undefined
  }));
}
process.env.NODE_ENV !== "production" ? DefaultChartsLegend.propTypes = {
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
  direction: _propTypes.default.oneOf(['column', 'row']).isRequired,
  /**
   * @deprecated Use the `useDrawingArea` hook instead.
   */
  drawingArea: _propTypes.default.shape({
    bottom: _propTypes.default.number.isRequired,
    height: _propTypes.default.number.isRequired,
    left: _propTypes.default.number.isRequired,
    right: _propTypes.default.number.isRequired,
    top: _propTypes.default.number.isRequired,
    width: _propTypes.default.number.isRequired
  }).isRequired,
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
  }).isRequired,
  series: _propTypes.default.object.isRequired,
  seriesToDisplay: _propTypes.default.arrayOf(_propTypes.default.shape({
    color: _propTypes.default.string.isRequired,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
    itemId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    label: _propTypes.default.string.isRequired,
    maxValue: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    minValue: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  })).isRequired
} : void 0;