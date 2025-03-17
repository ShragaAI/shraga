'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["xAxis", "yAxis", "series", "width", "height", "margin", "colors", "sx", "tooltip", "axisHighlight", "skipAnimation", "legend", "topAxis", "leftAxis", "rightAxis", "bottomAxis", "children", "slots", "slotProps", "onItemClick", "loading", "highlightedItem", "onHighlightChange", "className"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useRtl } from '@mui/system/RtlProvider';
import { useThemeProps } from '@mui/material/styles';
import { ResponsiveChartContainer } from "../ResponsiveChartContainer/index.js";
import { ChartsAxis } from "../ChartsAxis/ChartsAxis.js";
import { DEFAULT_X_AXIS_KEY } from "../constants/index.js";
import { ChartsTooltip } from "../ChartsTooltip/index.js";
import { ChartsLegend } from "../ChartsLegend/index.js";
import { ChartsAxisHighlight } from "../ChartsAxisHighlight/index.js";
import { PiePlot } from "./PiePlot.js";
import { ChartsOverlay } from "../ChartsOverlay/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const defaultMargin = {
  top: 5,
  bottom: 5,
  left: 5,
  right: 100
};
const defaultRTLMargin = {
  top: 5,
  bottom: 5,
  left: 100,
  right: 5
};

/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PieChart API](https://mui.com/x/api/charts/pie-chart/)
 */
const PieChart = /*#__PURE__*/React.forwardRef(function PieChart(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiPieChart'
  });
  const {
      xAxis,
      yAxis,
      series,
      width,
      height,
      margin: marginProps,
      colors,
      sx,
      tooltip = {
        trigger: 'item'
      },
      axisHighlight = {
        x: 'none',
        y: 'none'
      },
      skipAnimation,
      legend: legendProps,
      topAxis = null,
      leftAxis = null,
      rightAxis = null,
      bottomAxis = null,
      children,
      slots,
      slotProps,
      onItemClick,
      loading,
      highlightedItem,
      onHighlightChange,
      className
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const isRtl = useRtl();
  const margin = _extends({}, isRtl ? defaultRTLMargin : defaultMargin, marginProps);
  const legend = _extends({
    direction: 'column',
    position: {
      vertical: 'middle',
      horizontal: isRtl ? 'left' : 'right'
    }
  }, legendProps);
  return /*#__PURE__*/_jsxs(ResponsiveChartContainer, _extends({}, other, {
    ref: ref,
    series: series.map(s => _extends({
      type: 'pie'
    }, s)),
    width: width,
    height: height,
    margin: margin,
    xAxis: xAxis ?? [{
      id: DEFAULT_X_AXIS_KEY,
      scaleType: 'point',
      data: [...new Array(Math.max(0, ...series.map(s => s.data.length)))].map((_, index) => index)
    }],
    yAxis: yAxis,
    colors: colors,
    sx: sx,
    disableAxisListener: tooltip?.trigger !== 'axis' && axisHighlight?.x === 'none' && axisHighlight?.y === 'none',
    highlightedItem: highlightedItem,
    onHighlightChange: onHighlightChange,
    className: className,
    skipAnimation: skipAnimation,
    children: [/*#__PURE__*/_jsx(ChartsAxis, {
      topAxis: topAxis,
      leftAxis: leftAxis,
      rightAxis: rightAxis,
      bottomAxis: bottomAxis,
      slots: slots,
      slotProps: slotProps
    }), /*#__PURE__*/_jsx(PiePlot, {
      slots: slots,
      slotProps: slotProps,
      onItemClick: onItemClick
    }), /*#__PURE__*/_jsx(ChartsOverlay, {
      loading: loading,
      slots: slots,
      slotProps: slotProps
    }), /*#__PURE__*/_jsx(ChartsLegend, _extends({}, legend, {
      slots: slots,
      slotProps: slotProps
    })), /*#__PURE__*/_jsx(ChartsAxisHighlight, _extends({}, axisHighlight)), !loading && /*#__PURE__*/_jsx(ChartsTooltip, _extends({}, tooltip, {
      slots: slots,
      slotProps: slotProps
    })), children]
  }));
});
process.env.NODE_ENV !== "production" ? PieChart.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The configuration of axes highlight.
   * @see See {@link https://mui.com/x/react-charts/highlighting/ highlighting docs} for more details.
   * @default { x: 'none', y: 'none' }
   */
  axisHighlight: PropTypes.shape({
    x: PropTypes.oneOf(['band', 'line', 'none']),
    y: PropTypes.oneOf(['band', 'line', 'none'])
  }),
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  bottomAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.node,
  className: PropTypes.string,
  /**
   * Color palette used to colorize multiple series.
   * @default blueberryTwilightPalette
   */
  colors: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.func]),
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  desc: PropTypes.string,
  /**
   * If `true`, the charts will not listen to the mouse move event.
   * It might break interactive features, but will improve performance.
   * @default false
   */
  disableAxisListener: PropTypes.bool,
  /**
   * The height of the chart in px. If not defined, it takes the height of the parent element.
   */
  height: PropTypes.number,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: PropTypes.shape({
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  leftAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * The props of the legend.
   * @default { direction: 'column', position: { vertical: 'middle', horizontal: 'right' } }
   * @deprecated Consider using `slotProps.legend` instead.
   */
  legend: PropTypes.shape({
    classes: PropTypes.object,
    direction: PropTypes.oneOf(['column', 'row']),
    hidden: PropTypes.bool,
    itemGap: PropTypes.number,
    itemMarkHeight: PropTypes.number,
    itemMarkWidth: PropTypes.number,
    labelStyle: PropTypes.object,
    markGap: PropTypes.number,
    onItemClick: PropTypes.func,
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number,
      top: PropTypes.number
    })]),
    position: PropTypes.shape({
      horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
      vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired
    }),
    slotProps: PropTypes.object,
    slots: PropTypes.object
  }),
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading: PropTypes.bool,
  /**
   * The margin between the SVG and the drawing area.
   * It's used for leaving some space for extra information such as the x- and y-axis or legend.
   * Accepts an object with the optional properties: `top`, `bottom`, `left`, and `right`.
   * @default object Depends on the charts type.
   */
  margin: PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  }),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
  /**
   * Callback fired when a pie arc is clicked.
   */
  onItemClick: PropTypes.func,
  /**
   * The chart will try to wait for the parent container to resolve its size
   * before it renders for the first time.
   *
   * This can be useful in some scenarios where the chart appear to grow after
   * the first render, like when used inside a grid.
   *
   * @default false
   */
  resolveSizeBeforeRender: PropTypes.bool,
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  /**
   * The series to display in the pie chart.
   * An array of [[PieSeriesType]] objects.
   */
  series: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * If `true`, animations are skipped.
   * If unset or `false`, the animations respects the user's `prefers-reduced-motion` setting.
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  title: PropTypes.string,
  /**
   * The configuration of the tooltip.
   * @see See {@link https://mui.com/x/react-charts/tooltip/ tooltip docs} for more details.
   * @default { trigger: 'item' }
   */
  tooltip: PropTypes.shape({
    axisContent: PropTypes.elementType,
    classes: PropTypes.object,
    itemContent: PropTypes.elementType,
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    trigger: PropTypes.oneOf(['axis', 'item', 'none'])
  }),
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  viewBox: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number
  }),
  /**
   * The width of the chart in px. If not defined, it takes the width of the parent element.
   */
  width: PropTypes.number,
  /**
   * The configuration of the x-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  xAxis: PropTypes.arrayOf(PropTypes.shape({
    classes: PropTypes.object,
    colorMap: PropTypes.oneOfType([PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      type: PropTypes.oneOf(['ordinal']).isRequired,
      unknownColor: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]).isRequired)
    }), PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.func]).isRequired,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      type: PropTypes.oneOf(['continuous']).isRequired
    }), PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      thresholds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired).isRequired,
      type: PropTypes.oneOf(['piecewise']).isRequired
    })]),
    data: PropTypes.array,
    dataKey: PropTypes.string,
    disableLine: PropTypes.bool,
    disableTicks: PropTypes.bool,
    domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['bottom', 'top']),
    reverse: PropTypes.bool,
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
    tickFontSize: PropTypes.number,
    tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
    tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
    tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
    tickLabelStyle: PropTypes.object,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func
  })),
  /**
   * The configuration of the y-axes.
   * If not provided, a default axis config is used.
   * An array of [[AxisConfig]] objects.
   */
  yAxis: PropTypes.arrayOf(PropTypes.shape({
    classes: PropTypes.object,
    colorMap: PropTypes.oneOfType([PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      type: PropTypes.oneOf(['ordinal']).isRequired,
      unknownColor: PropTypes.string,
      values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]).isRequired)
    }), PropTypes.shape({
      color: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string.isRequired), PropTypes.func]).isRequired,
      max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
      type: PropTypes.oneOf(['continuous']).isRequired
    }), PropTypes.shape({
      colors: PropTypes.arrayOf(PropTypes.string).isRequired,
      thresholds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired).isRequired,
      type: PropTypes.oneOf(['piecewise']).isRequired
    })]),
    data: PropTypes.array,
    dataKey: PropTypes.string,
    disableLine: PropTypes.bool,
    disableTicks: PropTypes.bool,
    domainLimit: PropTypes.oneOfType([PropTypes.oneOf(['nice', 'strict']), PropTypes.func]),
    fill: PropTypes.string,
    hideTooltip: PropTypes.bool,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    label: PropTypes.string,
    labelFontSize: PropTypes.number,
    labelStyle: PropTypes.object,
    max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
    position: PropTypes.oneOf(['left', 'right']),
    reverse: PropTypes.bool,
    scaleType: PropTypes.oneOf(['band', 'linear', 'log', 'point', 'pow', 'sqrt', 'time', 'utc']),
    slotProps: PropTypes.object,
    slots: PropTypes.object,
    stroke: PropTypes.string,
    sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
    tickFontSize: PropTypes.number,
    tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
    tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
    tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
    tickLabelStyle: PropTypes.object,
    tickMaxStep: PropTypes.number,
    tickMinStep: PropTypes.number,
    tickNumber: PropTypes.number,
    tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
    tickSize: PropTypes.number,
    valueFormatter: PropTypes.func
  }))
} : void 0;
export { PieChart };