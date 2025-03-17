'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["axisDirection", "axisId", "hideFirst", "hideLast", "labelFormatter", "onItemClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useAxis } from "./useAxis.js";
import { LegendPerItem } from "./LegendPerItem.js";
import { notNull } from "../internals/notNull.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const axisItem = useAxis({
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
    const data = _extends({}, isFirst ? {
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
  }).filter(notNull);
  return /*#__PURE__*/_jsx(LegendPerItem, _extends({}, other, {
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
  axisDirection: PropTypes.oneOf(['x', 'y', 'z']),
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']).isRequired,
  /**
   * Hide the first item of the legend, corresponding to the [-infinity, min] piece.
   * @default false
   */
  hideFirst: PropTypes.bool,
  /**
   * Hide the last item of the legend, corresponding to the [max, +infinity] piece.
   * @default false
   */
  hideLast: PropTypes.bool,
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap: PropTypes.number,
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight: PropTypes.number,
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth: PropTypes.number,
  /**
   * Format the legend labels.
   * @param {PiecewiseLabelFormatterParams} params The bound of the piece to format.
   * @returns {string|null} The displayed label, or `null` to skip the item.
   */
  labelFormatter: PropTypes.func,
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: PropTypes.object,
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap: PropTypes.number,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {PiecewiseColorLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: PropTypes.func,
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  })]),
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired
  }).isRequired
} : void 0;
export { PiecewiseColorLegend };