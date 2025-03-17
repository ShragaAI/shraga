'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["slots", "slotProps", "skipAnimation", "onItemClick", "experimentalRendering"];
import PropTypes from 'prop-types';
import * as React from 'react';
import { DEFAULT_X_AXIS_KEY } from "../constants/index.js";
import { useSkipAnimation } from "../context/AnimationProvider/index.js";
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { useChartId } from "../hooks/useChartId.js";
import { useDrawingArea } from "../hooks/useDrawingArea.js";
import { getValueToPositionMapper } from "../hooks/useScale.js";
import { useLineSeries } from "../hooks/useSeries.js";
import { cleanId } from "../internals/cleanId.js";
import { CircleMarkElement } from "./CircleMarkElement.js";
import getColor from "./getColor.js";
import { MarkElement } from "./MarkElement.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const skipAnimation = useSkipAnimation(inSkipAnimation);
  const seriesData = useLineSeries();
  const axisData = useCartesianContext();
  const chartId = useChartId();
  const drawingArea = useDrawingArea();
  const Mark = slots?.mark ?? (experimentalRendering ? CircleMarkElement : MarkElement);
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
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
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
        const xScale = getValueToPositionMapper(xAxis[xAxisId].scale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;
        if (xData === undefined) {
          throw new Error(`MUI X: ${xAxisId === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisId}"`} should have data property to be able to display a line plot.`);
        }
        const clipId = cleanId(`${chartId}-${seriesId}-line-clip`); // We assume that if displaying line mark, the line will also be rendered

        const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
        return /*#__PURE__*/_jsx("g", {
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
            return /*#__PURE__*/_jsx(Mark, _extends({
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
  experimentalRendering: PropTypes.bool,
  /**
   * Callback fired when a line mark item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line mark item identifier.
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
export { MarkPlot };