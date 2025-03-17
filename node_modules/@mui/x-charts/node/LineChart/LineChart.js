"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LineChart = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _AreaPlot = require("./AreaPlot");
var _LinePlot = require("./LinePlot");
var _ResponsiveChartContainer = require("../ResponsiveChartContainer");
var _MarkPlot = require("./MarkPlot");
var _ChartsAxis = require("../ChartsAxis/ChartsAxis");
var _ChartsTooltip = require("../ChartsTooltip");
var _ChartsLegend = require("../ChartsLegend");
var _ChartsAxisHighlight = require("../ChartsAxisHighlight");
var _ChartsClipPath = require("../ChartsClipPath");
var _LineHighlightPlot = require("./LineHighlightPlot");
var _ChartsGrid = require("../ChartsGrid");
var _ChartsOnAxisClickHandler = require("../ChartsOnAxisClickHandler");
var _ChartsOverlay = require("../ChartsOverlay");
var _useLineChartProps = require("./useLineChartProps");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineChart API](https://mui.com/x/api/charts/line-chart/)
 */
const LineChart = exports.LineChart = /*#__PURE__*/React.forwardRef(function LineChart(inProps, ref) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiLineChart'
  });
  const {
    chartContainerProps,
    axisClickHandlerProps,
    gridProps,
    clipPathProps,
    clipPathGroupProps,
    areaPlotProps,
    linePlotProps,
    markPlotProps,
    overlayProps,
    chartsAxisProps,
    axisHighlightProps,
    lineHighlightPlotProps,
    legendProps,
    tooltipProps,
    children
  } = (0, _useLineChartProps.useLineChartProps)(props);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ResponsiveChartContainer.ResponsiveChartContainer, (0, _extends2.default)({
    ref: ref
  }, chartContainerProps, {
    children: [props.onAxisClick && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsOnAxisClickHandler.ChartsOnAxisClickHandler, (0, _extends2.default)({}, axisClickHandlerProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsGrid.ChartsGrid, (0, _extends2.default)({}, gridProps)), /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", (0, _extends2.default)({}, clipPathGroupProps, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_AreaPlot.AreaPlot, (0, _extends2.default)({}, areaPlotProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_LinePlot.LinePlot, (0, _extends2.default)({}, linePlotProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsOverlay.ChartsOverlay, (0, _extends2.default)({}, overlayProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsAxisHighlight.ChartsAxisHighlight, (0, _extends2.default)({}, axisHighlightProps))]
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsAxis.ChartsAxis, (0, _extends2.default)({}, chartsAxisProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
      "data-drawing-container": true,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_MarkPlot.MarkPlot, (0, _extends2.default)({}, markPlotProps))
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_LineHighlightPlot.LineHighlightPlot, (0, _extends2.default)({}, lineHighlightPlotProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsLegend.ChartsLegend, (0, _extends2.default)({}, legendProps)), !props.loading && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsTooltip.ChartsTooltip, (0, _extends2.default)({}, tooltipProps)), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsClipPath.ChartsClipPath, (0, _extends2.default)({}, clipPathProps)), children]
  }));
});
process.env.NODE_ENV !== "production" ? LineChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'line' }
   */
  axisHighlight: _propTypes.default.shape({
    x: _propTypes.default.oneOf(['band', 'line', 'none']),
    y: _propTypes.default.oneOf(['band', 'line', 'none'])
  }),
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  children: _propTypes.default.node,
  className: _propTypes.default.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: _propTypes.default.arrayOf(_propTypes.default.object),
  desc: _propTypes.default.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: _propTypes.default.bool,
  /**
   * If `true`, render the line highlight item.
   */
  disableLineItemHighlight: _propTypes.default.bool,
  /**
   * If `true` marks will render `<circle />` instead of `<path />` and drop theme override for faster rendering.
   */
  experimentalMarkRendering: _propTypes.default.bool,
  /**
   * Option to display a cartesian grid in the background.
   */
  grid: _propTypes.default.shape({
    horizontal: _propTypes.default.bool,
    vertical: _propTypes.default.bool
  }),
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: _propTypes.default.number,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: _propTypes.default.shape({
    dataIndex: _propTypes.default.number,
    seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  /**
   * @deprecated Consider using `slotProps.legend` instead.
   */
  legend: _propTypes.default.shape({
    classes: _propTypes.default.object,
    direction: _propTypes.default.oneOf(['column', 'row']),
    hidden: _propTypes.default.bool,
    itemGap: _propTypes.default.number,
    itemMarkHeight: _propTypes.default.number,
    itemMarkWidth: _propTypes.default.number,
    labelStyle: _propTypes.default.object,
    markGap: _propTypes.default.number,
    onItemClick: _propTypes.default.func,
    padding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
      bottom: _propTypes.default.number,
      left: _propTypes.default.number,
      right: _propTypes.default.number,
      top: _propTypes.default.number
    })]),
    position: _propTypes.default.shape({
      horizontal: _propTypes.default.oneOf(['left', 'middle', 'right']).isRequired,
      vertical: _propTypes.default.oneOf(['bottom', 'middle', 'top']).isRequired
    }),
    slotProps: _propTypes.default.object,
    slots: _propTypes.default.object
  }),
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: _propTypes.default.bool,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: _propTypes.default.shape({
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number,
    top: _propTypes.default.number
  }),
  /**
   * Callback fired when an area element is clicked.
   */
  onAreaClick: _propTypes.default.func,
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: _propTypes.default.func,
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: _propTypes.default.func,
  /**
   * Callback fired when a line element is clicked.
   */
  onLineClick: _propTypes.default.func,
  /**
   * Callback fired when a mark element is clicked.
   */
  onMarkClick: _propTypes.default.func,
  /**
   * The chart will try to wait for the parent container to resolve its size
   * before it renders for the first time.
   *
   * This can be useful in some scenarios where the chart appear to grow after
   * the first render, like when used inside a grid.
   *
   * @default false
   */
  resolveSizeBeforeRender: _propTypes.default.bool,
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  /**
   * The series to display in the line chart.
   * An array of [[LineSeriesType]] objects.
   */
  series: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
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
  slots: _propTypes.default.object,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  title: _propTypes.default.string,
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   * @default { trigger: 'item' }
   */
  tooltip: _propTypes.default.shape({
    axisContent: _propTypes.default.elementType,
    classes: _propTypes.default.object,
    itemContent: _propTypes.default.elementType,
    slotProps: _propTypes.default.object,
    slots: _propTypes.default.object,
    trigger: _propTypes.default.oneOf(['axis', 'item', 'none'])
  }),
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  viewBox: _propTypes.default.shape({
    height: _propTypes.default.number,
    width: _propTypes.default.number,
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: _propTypes.default.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: _propTypes.default.arrayOf(_propTypes.default.shape({
    classes: _propTypes.default.object,
    colorMap: _propTypes.default.oneOfType([_propTypes.default.shape({
      colors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      type: _propTypes.default.oneOf(['ordinal']).isRequired,
      unknownColor: _propTypes.default.string,
      values: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired)
    }), _propTypes.default.shape({
      color: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string.isRequired), _propTypes.default.func]).isRequired,
      max: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
      min: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
      type: _propTypes.default.oneOf(['continuous']).isRequired
    }), _propTypes.default.shape({
      colors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      thresholds: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]).isRequired).isRequired,
      type: _propTypes.default.oneOf(['piecewise']).isRequired
    })]),
    data: _propTypes.default.array,
    dataKey: _propTypes.default.string,
    disableLine: _propTypes.default.bool,
    disableTicks: _propTypes.default.bool,
    domainLimit: _propTypes.default.oneOfType([_propTypes.default.oneOf(['nice', 'strict']), _propTypes.default.func]),
    fill: _propTypes.default.string,
    hideTooltip: _propTypes.default.bool,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    label: _propTypes.default.string,
    labelFontSize: _propTypes.default.number,
    labelStyle: _propTypes.default.object,
    max: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    min: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    position: _propTypes.default.oneOf(['bottom', 'top']),
    reverse: _propTypes.default.bool,
    scaleType: _propTypes.default.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: _propTypes.default.object,
    slots: _propTypes.default.object,
    stroke: _propTypes.default.string,
    sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
    tickFontSize: _propTypes.default.number,
    tickInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.array, _propTypes.default.func]),
    tickLabelInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.func]),
    tickLabelPlacement: _propTypes.default.oneOf(['middle', 'tick']),
    tickLabelStyle: _propTypes.default.object,
    tickMaxStep: _propTypes.default.number,
    tickMinStep: _propTypes.default.number,
    tickNumber: _propTypes.default.number,
    tickPlacement: _propTypes.default.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: _propTypes.default.number,
    valueFormatter: _propTypes.default.func
  })),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: _propTypes.default.arrayOf(_propTypes.default.shape({
    classes: _propTypes.default.object,
    colorMap: _propTypes.default.oneOfType([_propTypes.default.shape({
      colors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      type: _propTypes.default.oneOf(['ordinal']).isRequired,
      unknownColor: _propTypes.default.string,
      values: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number, _propTypes.default.string]).isRequired)
    }), _propTypes.default.shape({
      color: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string.isRequired), _propTypes.default.func]).isRequired,
      max: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
      min: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
      type: _propTypes.default.oneOf(['continuous']).isRequired
    }), _propTypes.default.shape({
      colors: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
      thresholds: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]).isRequired).isRequired,
      type: _propTypes.default.oneOf(['piecewise']).isRequired
    })]),
    data: _propTypes.default.array,
    dataKey: _propTypes.default.string,
    disableLine: _propTypes.default.bool,
    disableTicks: _propTypes.default.bool,
    domainLimit: _propTypes.default.oneOfType([_propTypes.default.oneOf(['nice', 'strict']), _propTypes.default.func]),
    fill: _propTypes.default.string,
    hideTooltip: _propTypes.default.bool,
    id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    label: _propTypes.default.string,
    labelFontSize: _propTypes.default.number,
    labelStyle: _propTypes.default.object,
    max: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    min: _propTypes.default.oneOfType([_propTypes.default.instanceOf(Date), _propTypes.default.number]),
    position: _propTypes.default.oneOf(['left', 'right']),
    reverse: _propTypes.default.bool,
    scaleType: _propTypes.default.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: _propTypes.default.object,
    slots: _propTypes.default.object,
    stroke: _propTypes.default.string,
    sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
    tickFontSize: _propTypes.default.number,
    tickInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.array, _propTypes.default.func]),
    tickLabelInterval: _propTypes.default.oneOfType([_propTypes.default.oneOf(['auto']), _propTypes.default.func]),
    tickLabelPlacement: _propTypes.default.oneOf(['middle', 'tick']),
    tickLabelStyle: _propTypes.default.object,
    tickMaxStep: _propTypes.default.number,
    tickMinStep: _propTypes.default.number,
    tickNumber: _propTypes.default.number,
    tickPlacement: _propTypes.default.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: _propTypes.default.number,
    valueFormatter: _propTypes.default.func
  }))
} : void 0;