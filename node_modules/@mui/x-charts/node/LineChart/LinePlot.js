"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinePlot = LinePlot;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _CartesianProvider = require("../context/CartesianProvider");
var _LineElement = require("./LineElement");
var _useScale = require("../hooks/useScale");
var _getCurve = _interopRequireDefault(require("../internals/getCurve"));
var _constants = require("../constants");
var _ChartsAxesGradients = require("../internals/components/ChartsAxesGradients");
var _useSeries = require("../hooks/useSeries");
var _AnimationProvider = require("../context/AnimationProvider");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick"];
const useAggregatedData = () => {
  const seriesData = (0, _useSeries.useLineSeries)();
  const axisData = (0, _CartesianProvider.useCartesianContext)();

  // This memo prevents odd line chart behavior when hydrating.
  const allData = React.useMemo(() => {
    if (seriesData === undefined) {
      return [];
    }
    const {
      series,
      stackingGroups
    } = seriesData;
    const {
      xAxis,
      yAxis,
      xAxisIds,
      yAxisIds
    } = axisData;
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];
    return stackingGroups.flatMap(({
      ids: groupIds
    }) => {
      return groupIds.flatMap(seriesId => {
        const {
          xAxisId: xAxisIdProp,
          yAxisId: yAxisIdProp,
          xAxisKey = defaultXAxisId,
          yAxisKey = defaultYAxisId,
          stackedData,
          data,
          connectNulls
        } = series[seriesId];
        const xAxisId = xAxisIdProp ?? xAxisKey;
        const yAxisId = yAxisIdProp ?? yAxisKey;
        const xScale = (0, _useScale.getValueToPositionMapper)(xAxis[xAxisId].scale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;
        const gradientUsed = yAxis[yAxisId].colorScale && [yAxisId, 'y'] || xAxis[xAxisId].colorScale && [xAxisId, 'x'] || undefined;
        if (process.env.NODE_ENV !== 'production') {
          if (xData === undefined) {
            throw new Error(`MUI X: ${xAxisId === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisId}"`} should have data property to be able to display a line plot.`);
          }
          if (xData.length < stackedData.length) {
            throw new Error(`MUI X: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`);
          }
        }
        const linePath = (0, _d3Shape.line)().x(d => xScale(d.x)).defined((_, i) => connectNulls || data[i] != null).y(d => yScale(d.y[1]));
        const formattedData = xData?.map((x, index) => ({
          x,
          y: stackedData[index]
        })) ?? [];
        const d3Data = connectNulls ? formattedData.filter((_, i) => data[i] != null) : formattedData;
        const d = linePath.curve((0, _getCurve.default)(series[seriesId].curve))(d3Data) || '';
        return (0, _extends2.default)({}, series[seriesId], {
          gradientUsed,
          d,
          seriesId
        });
      });
    });
  }, [seriesData, axisData]);
  return allData;
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LinePlot API](https://mui.com/x/api/charts/line-plot/)
 */
function LinePlot(props) {
  const {
      slots,
      slotProps,
      skipAnimation: inSkipAnimation,
      onItemClick
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const skipAnimation = (0, _AnimationProvider.useSkipAnimation)(inSkipAnimation);
  const getGradientId = (0, _ChartsAxesGradients.useChartGradient)();
  const completedData = useAggregatedData();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", (0, _extends2.default)({}, other, {
    children: completedData.map(({
      d,
      seriesId,
      color,
      gradientUsed
    }) => {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_LineElement.LineElement, {
        id: seriesId,
        d: d,
        color: color,
        gradientId: gradientUsed && getGradientId(...gradientUsed),
        skipAnimation: skipAnimation,
        slots: slots,
        slotProps: slotProps,
        onClick: onItemClick && (event => onItemClick(event, {
          type: 'line',
          seriesId
        }))
      }, seriesId);
    })
  }));
}
process.env.NODE_ENV !== "production" ? LinePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick: _propTypes.default.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: _propTypes.default.bool,
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