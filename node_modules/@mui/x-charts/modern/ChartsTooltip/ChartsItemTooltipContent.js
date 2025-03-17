import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import useSlotProps from '@mui/utils/useSlotProps';
import { DefaultChartsItemTooltipContent } from "./DefaultChartsItemTooltipContent.js";
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { ZAxisContext } from "../context/ZAxisContextProvider.js";
import { useColorProcessor } from "../context/PluginProvider/useColorProcessor.js";
import { useSeries } from "../hooks/useSeries.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
  const series = useSeries()[itemData.type].series[itemData.seriesId];
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = useCartesianContext();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(ZAxisContext);
  const colorProcessors = useColorProcessor();
  const xAxisId = series.xAxisId ?? series.xAxisKey ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? series.yAxisKey ?? yAxisIds[0];
  const zAxisId = series.zAxisId ?? series.zAxisKey ?? zAxisIds[0];
  const getColor = colorProcessors[series.type]?.(series, xAxisId && xAxis[xAxisId], yAxisId && yAxis[yAxisId], zAxisId && zAxis[zAxisId]) ?? (() => '');
  const Content = content ?? DefaultChartsItemTooltipContent;
  const chartTooltipContentProps = useSlotProps({
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
  return /*#__PURE__*/_jsx(Content, _extends({}, chartTooltipContentProps));
}
export { ChartsItemTooltipContent };