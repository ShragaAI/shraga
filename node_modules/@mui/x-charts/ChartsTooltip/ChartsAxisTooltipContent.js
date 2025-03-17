import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { DefaultChartsAxisTooltipContent } from "./DefaultChartsAxisTooltipContent.js";
import { ZAxisContext } from "../context/ZAxisContextProvider.js";
import { useColorProcessor } from "../context/PluginProvider/useColorProcessor.js";
import { isCartesianSeriesType } from "../internals/isCartesian.js";
import { useSeries } from "../hooks/useSeries.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
  } = useCartesianContext();
  const {
    zAxisIds,
    zAxis
  } = React.useContext(ZAxisContext);
  const series = useSeries();
  const colorProcessors = useColorProcessor();
  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
  const relevantSeries = React.useMemo(() => {
    const rep = [];
    Object.keys(series).filter(isCartesianSeriesType).forEach(seriesType => {
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
          rep.push(_extends({}, seriesToAdd, {
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
  const Content = content ?? DefaultChartsAxisTooltipContent;
  const chartTooltipContentProps = useSlotProps({
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
  return /*#__PURE__*/_jsx(Content, _extends({}, chartTooltipContentProps));
}
export { ChartsAxisTooltipContent };