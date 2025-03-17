"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MarkPlot = MarkPlot;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var React = _interopRequireWildcard(require("react"));
var _constants = require("../constants");
var _AnimationProvider = require("../context/AnimationProvider");
var _CartesianProvider = require("../context/CartesianProvider");
var _useChartId = require("../hooks/useChartId");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _useScale = require("../hooks/useScale");
var _useSeries = require("../hooks/useSeries");
var _cleanId = require("../internals/cleanId");
var _CircleMarkElement = require("./CircleMarkElement");
var _getColor = _interopRequireDefault(require("./getColor"));
var _MarkElement = require("./MarkElement");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick", "experimentalRendering"];
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkPlot API](https://mui.com/x/api/charts/mark-plot/)
 */
function MarkPlot(props) {
  const {
      slots,
      slotProps,
      skipAnimation: inSkipAnimation,
      onItemClick,
      experimentalRendering
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const skipAnimation = (0, _AnimationProvider.useSkipAnimation)(inSkipAnimation);
  const seriesData = (0, _useSeries.useLineSeries)();
  const axisData = (0, _CartesianProvider.useCartesianContext)();
  const chartId = (0, _useChartId.useChartId)();
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const Mark = slots?.mark ?? (experimentalRendering ? _CircleMarkElement.CircleMarkElement : _MarkElement.MarkElement);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", (0, _extends2.default)({}, other, {
    children: stackingGroups.flatMap(({
      ids: groupIds
    }) => {
      return groupIds.map(seriesId => {
        const {
          xAxisId: xAxisIdProp,
          yAxisId: yAxisIdProp,
          xAxisKey = defaultXAxisId,
          yAxisKey = defaultYAxisId,
          stackedData,
          data,
          showMark = true
        } = series[seriesId];
        if (showMark === false) {
          return null;
        }
        const xAxisId = xAxisIdProp ?? xAxisKey;
        const yAxisId = yAxisIdProp ?? yAxisKey;
        const xScale = (0, _useScale.getValueToPositionMapper)(xAxis[xAxisId].scale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;
        if (xData === undefined) {
          throw new Error(`MUI X: ${xAxisId === _constants.DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisId}"`} should have data property to be able to display a line plot.`);
        }
        const clipId = (0, _cleanId.cleanId)(`${chartId}-${seriesId}-line-clip`); // We assume that if displaying line mark, the line will also be rendered

        const colorGetter = (0, _getColor.default)(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
          clipPath: `url(#${clipId})`,
          children: xData?.map((x, index) => {
            const value = data[index] == null ? null : stackedData[index][1];
            return {
              x: xScale(x),
              y: value === null ? null : yScale(value),
              position: x,
              value,
              index
            };
          }).filter(({
            x,
            y,
            index,
            position,
            value
          }) => {
            if (value === null || y === null) {
              // Remove missing data point
              return false;
            }
            if (!drawingArea.isPointInside({
              x,
              y
            })) {
              // Remove out of range
              return false;
            }
            if (showMark === true) {
              return true;
            }
            return showMark({
              x,
              y,
              index,
              position,
              value
            });
          }).map(({
            x,
            y,
            index
          }) => {
            return /*#__PURE__*/(0, _jsxRuntime.jsx)(Mark, (0, _extends2.default)({
              id: seriesId,
              dataIndex: index,
              shape: "circle",
              color: colorGetter(index),
              x: x,
              y: y // Don't know why TS doesn't get from the filter that y can't be null
              ,
              skipAnimation: skipAnimation,
              onClick: onItemClick && (event => onItemClick(event, {
                type: 'line',
                seriesId,
                dataIndex: index
              }))
            }, slotProps?.mark), `${seriesId}-${index}`);
          })
        }, seriesId);
      });
    })
  }));
}
process.env.NODE_ENV !== "production" ? MarkPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If `true` the mark element will only be able to render circle.
   * Giving fewer customization options, but saving around 40ms per 1.000 marks.
   * @default false
   */
  experimentalRendering: _propTypes.default.bool,
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
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