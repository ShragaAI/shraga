'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["slots", "slotProps"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { LineHighlightElement } from "./LineHighlightElement.js";
import { getValueToPositionMapper } from "../hooks/useScale.js";
import { InteractionContext } from "../context/InteractionProvider.js";
import { DEFAULT_X_AXIS_KEY } from "../constants/index.js";
import getColor from "./getColor.js";
import { useLineSeries } from "../hooks/useSeries.js";
import { useDrawingArea } from "../hooks/useDrawingArea.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightPlot API](https://mui.com/x/api/charts/line-highlight-plot/)
 */
function LineHighlightPlot(props) {
  const {
      slots,
      slotProps
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const seriesData = useLineSeries();
  const axisData = useCartesianContext();
  const drawingArea = useDrawingArea();
  const {
    axis
  } = React.useContext(InteractionContext);
  const highlightedIndex = axis.x?.index;
  if (highlightedIndex === undefined) {
    return null;
  }
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
  const Element = slots?.lineHighlight ?? LineHighlightElement;
  return /*#__PURE__*/_jsx("g", _extends({}, other, {
    children: stackingGroups.flatMap(({
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
          disableHighlight
        } = series[seriesId];
        const xAxisId = xAxisIdProp ?? xAxisKey;
        const yAxisId = yAxisIdProp ?? yAxisKey;
        if (disableHighlight || data[highlightedIndex] == null) {
          return null;
        }
        const xScale = getValueToPositionMapper(xAxis[xAxisId].scale);
        const yScale = yAxis[yAxisId].scale;
        const xData = xAxis[xAxisId].data;
        if (xData === undefined) {
          throw new Error(`MUI X: ${xAxisId === DEFAULT_X_AXIS_KEY ? 'The first `xAxis`' : `The x-axis with id "${xAxisId}"`} should have data property to be able to display a line plot.`);
        }
        const x = xScale(xData[highlightedIndex]);
        const y = yScale(stackedData[highlightedIndex][1]); // This should not be undefined since y should not be a band scale

        if (!drawingArea.isPointInside({
          x,
          y
        })) {
          return null;
        }
        const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
        return /*#__PURE__*/_jsx(Element, _extends({
          id: seriesId,
          color: colorGetter(highlightedIndex),
          x: x,
          y: y
        }, slotProps?.lineHighlight), `${seriesId}`);
      });
    })
  }));
}
process.env.NODE_ENV !== "production" ? LineHighlightPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
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
export { LineHighlightPlot };