'use client';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { line as d3Line } from '@mui/x-charts-vendor/d3-shape';
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { LineElement } from "./LineElement.js";
import { getValueToPositionMapper } from "../hooks/useScale.js";
import getCurveFactory from "../internals/getCurve.js";
import { DEFAULT_X_AXIS_KEY } from "../constants/index.js";
import { useChartGradient } from "../internals/components/ChartsAxesGradients/index.js";
import { useLineSeries } from "../hooks/useSeries.js";
import { useSkipAnimation } from "../context/AnimationProvider/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
const useAggregatedData = () => {
  const seriesData = useLineSeries();
  const axisData = useCartesianContext();

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
        const xScale = getValueToPositionMapper(xAxis[xAxisId].scale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;
        const gradientUsed = yAxis[yAxisId].colorScale && [yAxisId, 'y'] || xAxis[xAxisId].colorScale && [xAxisId, 'x'] || undefined;
        if (process.env.NODE_ENV !== 'production') {
          if (xData === undefined) {
            throw new Error(`MUI X: ${xAxisId === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisId}"`} should have data property to be able to display a line plot.`);
          }
          if (xData.length < stackedData.length) {
            throw new Error(`MUI X: The data length of the x axis (${xData.length} items) is lower than the length of series (${stackedData.length} items).`);
          }
        }
        const linePath = d3Line().x(d => xScale(d.x)).defined((_, i) => connectNulls || data[i] != null).y(d => yScale(d.y[1]));
        const formattedData = xData?.map((x, index) => ({
          x,
          y: stackedData[index]
        })) ?? [];
        const d3Data = connectNulls ? formattedData.filter((_, i) => data[i] != null) : formattedData;
        const d = linePath.curve(getCurveFactory(series[seriesId].curve))(d3Data) || '';
        return _extends({}, series[seriesId], {
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const skipAnimation = useSkipAnimation(inSkipAnimation);
  const getGradientId = useChartGradient();
  const completedData = useAggregatedData();
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
    children: completedData.map(({
      d,
      seriesId,
      color,
      gradientUsed
    }) => {
      return /*#__PURE__*/_jsx(LineElement, {
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
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default false
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
  slots: PropTypes.object
} : void 0;
export { LinePlot };