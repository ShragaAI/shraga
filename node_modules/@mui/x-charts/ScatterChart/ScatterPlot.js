'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { Scatter } from "./Scatter.js";
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import getColor from "./getColor.js";
import { ZAxisContext } from "../context/ZAxisContextProvider.js";
import { useScatterSeries } from "../hooks/useSeries.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [ScatterPlot API](https://mui.com/x/api/charts/scatter-plot/)
 */
function ScatterPlot(props) {
  const {
    slots,
    slotProps,
    onItemClick
  } = props;
  const seriesData = useScatterSeries();
  const axisData = useCartesianContext();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(ZAxisContext);
  if (seriesData === undefined) {
    return null;
  }
  const {
    series,
    seriesOrder
  } = seriesData;
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  const defaultZAxisId = zAxisIds[0];
  const ScatterItems = slots?.scatter ?? Scatter;
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: seriesOrder.map(seriesId => {
      const {
        id,
        xAxisKey,
        yAxisKey,
        zAxisKey,
        xAxisId,
        yAxisId,
        zAxisId,
        markerSize,
        color
      } = series[seriesId];
      const colorGetter = getColor(series[seriesId], xAxis[xAxisId ?? xAxisKey ?? defaultXAxisId], yAxis[yAxisId ?? yAxisKey ?? defaultYAxisId], zAxis[zAxisId ?? zAxisKey ?? defaultZAxisId]);
      const xScale = xAxis[xAxisId ?? xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? yAxisKey ?? defaultYAxisId].scale;
      return /*#__PURE__*/_jsx(ScatterItems, _extends({
        xScale: xScale,
        yScale: yScale,
        color: color,
        colorGetter: colorGetter,
        markerSize: markerSize ?? 4,
        series: series[seriesId],
        onItemClick: onItemClick
      }, slotProps?.scatter), id);
    })
  });
}
process.env.NODE_ENV !== "production" ? ScatterPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object
} : void 0;
export { ScatterPlot };