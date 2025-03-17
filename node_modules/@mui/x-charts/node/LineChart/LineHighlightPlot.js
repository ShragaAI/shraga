"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineHighlightPlot = LineHighlightPlot;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CartesianProvider = require("../context/CartesianProvider");
var _LineHighlightElement = require("./LineHighlightElement");
var _useScale = require("../hooks/useScale");
var _InteractionProvider = require("../context/InteractionProvider");
var _constants = require("../constants");
var _getColor = _interopRequireDefault(require("./getColor"));
var _useSeries = require("../hooks/useSeries");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps"];
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightPlot API](https://mui.com/x/api/charts/line-highlight-plot/)
 */
function LineHighlightPlot(props) {
  const {
      slots,
      slotProps
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const seriesData = (0, _useSeries.useLineSeries)();
  const axisData = (0, _CartesianProvider.useCartesianContext)();
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const {
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const highlightedIndex = axis.x?.index;
  if (highlightedIndex === undefined) {
    return null;
  }
  if (seriesData === undefined) {
    return null;
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
  const Element = slots?.lineHighlight ?? _LineHighlightElement.LineHighlightElement;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", (0, _extends2.default)({}, other, {
    children: stackingGroups.flatMap(({
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
          disableHighlight
        } = series[seriesId];
        const xAxisId = xAxisIdProp ?? xAxisKey;
        const yAxisId = yAxisIdProp ?? yAxisKey;
        if (disableHighlight || data[highlightedIndex] == null) {
          return null;
        }
        const xScale = (0, _useScale.getValueToPositionMapper)(xAxis[xAxisId].scale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;
        if (xData === undefined) {
          throw new Error(`MUI X: ${xAxisId === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisId}"`} should have data property to be able to display a line plot.`);
        }
        const x = xScale(xData[highlightedIndex]);
        const y = yScale(stackedData[highlightedIndex][1]); // This should not be undefined since y should not be a band scale

        if (!drawingArea.isPointInside({
          x,
          y
        })) {
          return null;
        }
        const colorGetter = (0, _getColor.default)(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(Element, (0, _extends2.default)({
          id: seriesId,
          color: colorGetter(highlightedIndex),
          x: x,
          y: y
        }, slotProps?.lineHighlight), `${seriesId}`);
      });
    })
  }));
}
process.env.NODE_ENV !== "production" ? LineHighlightPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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