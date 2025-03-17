'use client';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["slots", "slotProps", "onItemClick", "skipAnimation"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { area as d3Area } from '@mui/x-charts-vendor/d3-shape';
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { AreaElement } from "./AreaElement.js";
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
      return [...groupIds].reverse() // Revert stacked area for a more pleasant animation
      .map(seriesId => {
        const {
          xAxisId: xAxisIdProp,
          yAxisId: yAxisIdProp,
          xAxisKey = defaultXAxisId,
          yAxisKey = defaultYAxisId,
          stackedData,
          data,
          connectNulls,
          baseline
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
        const areaPath = d3Area().x(d => xScale(d.x)).defined((_, i) => connectNulls || data[i] != null).y0(d => {
          if (typeof baseline === 'number') {
            return yScale(baseline);
          }
          if (baseline === 'max') {
            return yScale.range()[1];
          }
          if (baseline === 'min') {
            return yScale.range()[0];
          }
          const value = d.y && yScale(d.y[0]);
          if (Number.isNaN(value)) {
            return yScale.range()[0];
          }
          return value;
        }).y1(d => d.y && yScale(d.y[1]));
        const curve = getCurveFactory(series[seriesId].curve);
        const formattedData = xData?.map((x, index) => ({
          x,
          y: stackedData[index]
        })) ?? [];
        const d3Data = connectNulls ? formattedData.filter((_, i) => data[i] != null) : formattedData;
        const d = areaPath.curve(curve)(d3Data) || '';
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
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [AreaPlot API](https://mui.com/x/api/charts/area-plot/)
 */
function AreaPlot(props) {
  const {
      slots,
      slotProps,
      onItemClick,
      skipAnimation: inSkipAnimation
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
      area,
      gradientUsed
    }) => !!area && /*#__PURE__*/_jsx(AreaElement, {
      id: seriesId,
      d: d,
      color: color,
      gradientId: gradientUsed && getGradientId(...gradientUsed),
      slots: slots,
      slotProps: slotProps,
      onClick: onItemClick && (event => onItemClick(event, {
        type: 'line',
        seriesId
      })),
      skipAnimation: skipAnimation
    }, seriesId))
  }));
}
process.env.NODE_ENV !== "production" ? AreaPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line area item is clicked.
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
export { AreaPlot };