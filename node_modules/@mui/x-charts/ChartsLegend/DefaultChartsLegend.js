'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["drawingArea", "seriesToDisplay", "hidden", "onItemClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { LegendPerItem } from "./LegendPerItem.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  if (hidden) {
    return null;
  }
  return /*#__PURE__*/_jsx(LegendPerItem, _extends({}, other, {
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
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']).isRequired,
  /**
   * @deprecated Use the `useDrawingArea` hook instead.
   */
  drawingArea: PropTypes.shape({
    bottom: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired
  }).isRequired,
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
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
   * @param {SeriesLegendItemContext} legendItem The legend item data.
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
  }).isRequired,
  series: PropTypes.object.isRequired,
  seriesToDisplay: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string.isRequired,
    maxValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    minValue: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  })).isRequired
} : void 0;
export { DefaultChartsLegend };