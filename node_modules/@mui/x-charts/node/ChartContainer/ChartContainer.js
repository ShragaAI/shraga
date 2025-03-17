"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartContainer = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _DrawingProvider = require("../context/DrawingProvider");
var _SeriesProvider = require("../context/SeriesProvider");
var _InteractionProvider = require("../context/InteractionProvider");
var _ChartsSurface = require("../ChartsSurface");
var _CartesianProvider = require("../context/CartesianProvider");
var _ChartsAxesGradients = require("../internals/components/ChartsAxesGradients");
var _context = require("../context");
var _PluginProvider = require("../context/PluginProvider");
var _useChartContainerProps = require("./useChartContainerProps");
var _AnimationProvider = require("../context/AnimationProvider");
var _jsxRuntime = require("react/jsx-runtime");
const ChartContainer = exports.ChartContainer = /*#__PURE__*/React.forwardRef(function ChartContainer(props, ref) {
  const {
    children,
    drawingProviderProps,
    seriesProviderProps,
    cartesianProviderProps,
    zAxisContextProps,
    highlightedProviderProps,
    chartsSurfaceProps,
    pluginProviderProps,
    animationProviderProps
  } = (0, _useChartContainerProps.useChartContainerProps)(props, ref);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_DrawingProvider.DrawingProvider, (0, _extends2.default)({}, drawingProviderProps, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_PluginProvider.PluginProvider, (0, _extends2.default)({}, pluginProviderProps, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SeriesProvider.SeriesProvider, (0, _extends2.default)({}, seriesProviderProps, {
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_CartesianProvider.CartesianProvider, (0, _extends2.default)({}, cartesianProviderProps, {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.ZAxisContextProvider, (0, _extends2.default)({}, zAxisContextProps, {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_InteractionProvider.InteractionProvider, {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.HighlightedProvider, (0, _extends2.default)({}, highlightedProviderProps, {
                children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_ChartsSurface.ChartsSurface, (0, _extends2.default)({}, chartsSurfaceProps, {
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsAxesGradients.ChartsAxesGradients, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_AnimationProvider.AnimationProvider, (0, _extends2.default)({}, animationProviderProps, {
                    children: children
                  }))]
                }))
              }))
            })
          }))
        }))
      }))
    }))
  }));
});
process.env.NODE_ENV !== "production" ? ChartContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
   * The height of the chart in px.
   */
  height: _propTypes.default.number.isRequired,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: _propTypes.default.shape({
    dataIndex: _propTypes.default.number,
    seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }),
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
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: _propTypes.default.func,
  /**
   * An array of plugins defining how to preprocess data.
   * If not provided, the container supports line, bar, scatter and pie charts.
   */
  plugins: _propTypes.default.arrayOf(_propTypes.default.object),
  /**
   * The array of series to display.
   * Each type of series has its own specificity.
   * Please refer to the appropriate docs page to learn more about it.
   */
  series: _propTypes.default.arrayOf(_propTypes.default.object).isRequired,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: _propTypes.default.bool,
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  title: _propTypes.default.string,
  viewBox: _propTypes.default.shape({
    height: _propTypes.default.number,
    width: _propTypes.default.number,
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  /**
   * The width of the chart in px.
   */
  width: _propTypes.default.number.isRequired,
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
  })),
  /**
   * The configuration of the z-axes.
   */
  zAxis: _propTypes.default.arrayOf(_propTypes.default.shape({
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
    id: _propTypes.default.string,
    max: _propTypes.default.number,
    min: _propTypes.default.number
  }))
} : void 0;