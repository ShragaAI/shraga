"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsItemTooltipContent = ChartsItemTooltipContent;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _DefaultChartsItemTooltipContent = require("./DefaultChartsItemTooltipContent");
var _CartesianProvider = require("../context/CartesianProvider");
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _useColorProcessor = require("../context/PluginProvider/useColorProcessor");
var _useSeries = require("../hooks/useSeries");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function ChartsItemTooltipContent(props) {
  const {
    content,
    itemData,
    sx,
    classes,
    contentProps
  } = props;
  const series = (0, _useSeries.useSeries)()[itemData.type].series[itemData.seriesId];
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
  const colorProcessors = (0, _useColorProcessor.useColorProcessor)();
  const xAxisId = series.xAxisId ?? series.xAxisKey ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? series.yAxisKey ?? yAxisIds[0];
  const zAxisId = series.zAxisId ?? series.zAxisKey ?? zAxisIds[0];
  const getColor = colorProcessors[series.type]?.(series, xAxisId && xAxis[xAxisId], yAxisId && yAxis[yAxisId], zAxisId && zAxis[zAxisId]) ?? (() => '');
  const Content = content ?? _DefaultChartsItemTooltipContent.DefaultChartsItemTooltipContent;
  const chartTooltipContentProps = (0, _useSlotProps.default)({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      itemData,
      series,
      sx,
      classes,
      getColor
    },
    ownerState: {}
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Content, (0, _extends2.default)({}, chartTooltipContentProps));
}