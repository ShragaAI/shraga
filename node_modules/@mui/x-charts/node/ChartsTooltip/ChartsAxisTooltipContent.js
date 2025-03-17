"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxisTooltipContent = ChartsAxisTooltipContent;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _CartesianProvider = require("../context/CartesianProvider");
var _DefaultChartsAxisTooltipContent = require("./DefaultChartsAxisTooltipContent");
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _useColorProcessor = require("../context/PluginProvider/useColorProcessor");
var _isCartesian = require("../internals/isCartesian");
var _useSeries = require("../hooks/useSeries");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function ChartsAxisTooltipContent(props) {
  const {
    content,
    contentProps,
    axisData,
    sx,
    classes
  } = props;
  const isXaxis = axisData.x && axisData.x.index !== -1;
  const dataIndex = isXaxis ? axisData.x && axisData.x.index : axisData.y && axisData.y.index;
  const axisValue = isXaxis ? axisData.x && axisData.x.value : axisData.y && axisData.y.value;
  const {
    xAxisIds,
    xAxis,
    yAxisIds,
    yAxis
  } = (0, _CartesianProvider.useCartesianContext)();
  const {
    zAxisIds,
    zAxis
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
  const series = (0, _useSeries.useSeries)();
  const colorProcessors = (0, _useColorProcessor.useColorProcessor)();
  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
  const relevantSeries = React.useMemo(() => {
    const rep = [];
    Object.keys(series).filter(_isCartesian.isCartesianSeriesType).forEach(seriesType => {
      series[seriesType].seriesOrder.forEach(seriesId => {
        const item = series[seriesType].series[seriesId];
        const providedXAxisId = item.xAxisId ?? item.xAxisKey;
        const providedYAxisId = item.yAxisId ?? item.yAxisKey;
        const axisKey = isXaxis ? providedXAxisId : providedYAxisId;
        if (axisKey === undefined || axisKey === USED_AXIS_ID) {
          const seriesToAdd = series[seriesType].series[seriesId];
          const xAxisId = providedXAxisId ?? xAxisIds[0];
          const yAxisId = providedYAxisId ?? yAxisIds[0];
          const zAxisId = seriesToAdd.zAxisId ?? seriesToAdd.zAxisKey ?? zAxisIds[0];
          const getColor = colorProcessors[seriesType]?.(seriesToAdd, xAxis[xAxisId], yAxis[yAxisId], zAxisId && zAxis[zAxisId]) ?? (() => '');
          rep.push((0, _extends2.default)({}, seriesToAdd, {
            getColor
          }));
        }
      });
    });
    return rep;
  }, [USED_AXIS_ID, colorProcessors, isXaxis, series, xAxis, xAxisIds, yAxis, yAxisIds, zAxis, zAxisIds]);
  const relevantAxis = React.useMemo(() => {
    return isXaxis ? xAxis[USED_AXIS_ID] : yAxis[USED_AXIS_ID];
  }, [USED_AXIS_ID, isXaxis, xAxis, yAxis]);
  const Content = content ?? _DefaultChartsAxisTooltipContent.DefaultChartsAxisTooltipContent;
  const chartTooltipContentProps = (0, _useSlotProps.default)({
    elementType: Content,
    externalSlotProps: contentProps,
    additionalProps: {
      axisData,
      series: relevantSeries,
      axis: relevantAxis,
      dataIndex,
      axisValue,
      sx,
      classes
    },
    ownerState: {}
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Content, (0, _extends2.default)({}, chartTooltipContentProps));
}