"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScatterPlot = ScatterPlot;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Scatter = require("./Scatter");
var _CartesianProvider = require("../context/CartesianProvider");
var _getColor = _interopRequireDefault(require("./getColor"));
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _useSeries = require("../hooks/useSeries");
var _jsxRuntime = require("react/jsx-runtime");
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
  const seriesData = (0, _useSeries.useScatterSeries)();
  const axisData = (0, _CartesianProvider.useCartesianContext)();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
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
  const ScatterItems = slots?.scatter ?? _Scatter.Scatter;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
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
      const colorGetter = (0, _getColor.default)(series[seriesId], xAxis[xAxisId ?? xAxisKey ?? defaultXAxisId], yAxis[yAxisId ?? yAxisKey ?? defaultYAxisId], zAxis[zAxisId ?? zAxisKey ?? defaultZAxisId]);
      const xScale = xAxis[xAxisId ?? xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? yAxisKey ?? defaultYAxisId].scale;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(ScatterItems, (0, _extends2.default)({
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
  onItemClick: _propTypes.default.func,
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