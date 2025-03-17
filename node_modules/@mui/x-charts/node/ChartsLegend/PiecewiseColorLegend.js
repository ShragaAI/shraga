"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PiecewiseColorLegend = PiecewiseColorLegend;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useAxis = require("./useAxis");
var _LegendPerItem = require("./LegendPerItem");
var _notNull = require("../internals/notNull");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["axisDirection", "axisId", "hideFirst", "hideLast", "labelFormatter", "onItemClick"];
function defaultLabelFormatter(params) {
  if (params.min === null) {
    return `<${params.formattedMax}`;
  }
  if (params.max === null) {
    return `>${params.formattedMin}`;
  }
  return `${params.formattedMin}-${params.formattedMax}`;
}
const piecewiseColorContextBuilder = context => ({
  type: 'piecewiseColor',
  color: context.color,
  label: context.label,
  maxValue: context.maxValue,
  minValue: context.minValue
});
function PiecewiseColorLegend(props) {
  const {
      axisDirection,
      axisId,
      hideFirst,
      hideLast,
      labelFormatter = defaultLabelFormatter,
      onItemClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const axisItem = (0, _useAxis.useAxis)({
    axisDirection,
    axisId
  });
  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type || colorMap.type !== 'piecewise') {
    return null;
  }
  const valueFormatter = v => axisItem.valueFormatter?.(v, {
    location: 'legend'
  }) ?? v.toLocaleString();
  const formattedLabels = colorMap.thresholds.map(valueFormatter);
  const itemsToDisplay = colorMap.colors.map((color, index) => {
    const isFirst = index === 0;
    const isLast = index === colorMap.colors.length - 1;
    if (hideFirst && isFirst || hideLast && isLast) {
      return null;
    }
    const data = (0, _extends2.default)({}, isFirst ? {
      min: null,
      formattedMin: null
    } : {
      min: colorMap.thresholds[index - 1],
      formattedMin: formattedLabels[index - 1]
    }, isLast ? {
      max: null,
      formattedMax: null
    } : {
      max: colorMap.thresholds[index],
      formattedMax: formattedLabels[index]
    });
    const label = labelFormatter(data);
    if (label === null) {
      return null;
    }
    return {
      id: label,
      color,
      label,
      minValue: data.min,
      maxValue: data.max
    };
  }).filter(_notNull.notNull);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_LegendPerItem.LegendPerItem, (0, _extends2.default)({}, other, {
    itemsToDisplay: itemsToDisplay,
    onItemClick: onItemClick ? (event, i) => onItemClick(event, piecewiseColorContextBuilder(itemsToDisplay[i]), i) : undefined
  }));
}
process.env.NODE_ENV !== "production" ? PiecewiseColorLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection: _propTypes.default.oneOf(['x', 'y', 'z']),
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
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
   * Hide the first item of the legend, corresponding to the [-infinity, min] piece.
   * @default false
   */
  hideFirst: _propTypes.default.bool,
  /**
   * Hide the last item of the legend, corresponding to the [max, +infinity] piece.
   * @default false
   */
  hideLast: _propTypes.default.bool,
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
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, or `null` to skip the item.
   */
  labelFormatter: _propTypes.default.func,
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
   * @param {PiecewiseColorLegendItemContext} legendItem The legend item data.
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
  }).isRequired
} : void 0;