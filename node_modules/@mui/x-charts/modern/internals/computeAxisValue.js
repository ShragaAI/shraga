import _extends from "@babel/runtime/helpers/esm/extends";
import { scaleBand, scalePoint, scaleTime } from '@mui/x-charts-vendor/d3-scale';
import { isBandScaleConfig, isPointScaleConfig } from "../models/axis.js";
import { getColorScale, getOrdinalColorScale } from "./colorScale.js";
import { getTickNumber } from "../hooks/useTicks.js";
import { getScale } from "./getScale.js";
import { zoomScaleRange } from "../context/CartesianProvider/zoom.js";
import { getAxisExtremum } from "../context/CartesianProvider/getAxisExtremum.js";
function getRange(drawingArea, axisDirection, axis) {
  if (axisDirection === 'rotation') {
    const {
      startAngle = 0,
      endAngle = startAngle + 360
    } = axis;
    return axis.reverse ? [Math.PI * startAngle / 180, Math.PI * endAngle / 180] : [Math.PI * endAngle / 180, Math.PI * startAngle / 180];
  }
  if (axisDirection === 'radius') {
    const {
      minRadius = 0,
      maxRadius = Math.min(drawingArea.width, drawingArea.height) / 2
    } = axis;
    return [minRadius, maxRadius];
  }
  const range = axisDirection === 'x' ? [drawingArea.left, drawingArea.left + drawingArea.width] : [drawingArea.top + drawingArea.height, drawingArea.top];
  return axis.reverse ? [range[1], range[0]] : range;
}
const isDateData = data => data?.[0] instanceof Date;
function createDateFormatter(axis, range) {
  const timeScale = scaleTime(axis.data, range);
  return (v, {
    location
  }) => location === 'tick' ? timeScale.tickFormat(axis.tickNumber)(v) : `${v.toLocaleString()}`;
}
const DEFAULT_CATEGORY_GAP_RATIO = 0.2;
const DEFAULT_BAR_GAP_RATIO = 0.1;
export function computeAxisValue({
  drawingArea,
  formattedSeries,
  axis: allAxis,
  extremumGetters,
  axisDirection,
  zoomData,
  zoomOptions,
  getFilters
}) {
  const completeAxis = {};
  allAxis.forEach((eachAxis, axisIndex) => {
    const axis = eachAxis;
    const zoomOption = zoomOptions?.[axis.id];
    const zoom = zoomData?.find(({
      axisId
    }) => axisId === axis.id);
    const zoomRange = zoom ? [zoom.start, zoom.end] : [0, 100];
    const range = getRange(drawingArea, axisDirection, axis);
    const [minData, maxData] = getAxisExtremum(axis, extremumGetters, axisIndex, formattedSeries, zoom === undefined && !zoomOption ? getFilters : undefined // Do not apply filtering if zoom is already defined.
    );
    const data = axis.data ?? [];
    if (isBandScaleConfig(axis)) {
      const categoryGapRatio = axis.categoryGapRatio ?? DEFAULT_CATEGORY_GAP_RATIO;
      const barGapRatio = axis.barGapRatio ?? DEFAULT_BAR_GAP_RATIO;
      // Reverse range because ordinal scales are presented from top to bottom on y-axis
      const scaleRange = axisDirection === 'y' ? [range[1], range[0]] : range;
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);
      completeAxis[axis.id] = _extends({
        categoryGapRatio,
        barGapRatio
      }, axis, {
        data,
        scale: scaleBand(axis.data, zoomedRange).paddingInner(categoryGapRatio).paddingOuter(categoryGapRatio / 2),
        tickNumber: axis.data.length,
        colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? getOrdinalColorScale(_extends({
          values: axis.data
        }, axis.colorMap)) : getColorScale(axis.colorMap))
      });
      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (isPointScaleConfig(axis)) {
      const scaleRange = axisDirection === 'y' ? [...range].reverse() : range;
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);
      completeAxis[axis.id] = _extends({}, axis, {
        data,
        scale: scalePoint(axis.data, zoomedRange),
        tickNumber: axis.data.length,
        colorScale: axis.colorMap && (axis.colorMap.type === 'ordinal' ? getOrdinalColorScale(_extends({
          values: axis.data
        }, axis.colorMap)) : getColorScale(axis.colorMap))
      });
      if (isDateData(axis.data)) {
        const dateFormatter = createDateFormatter(axis, scaleRange);
        completeAxis[axis.id].valueFormatter = axis.valueFormatter ?? dateFormatter;
      }
    }
    if (axis.scaleType === 'band' || axis.scaleType === 'point') {
      // Could be merged with the two previous "if conditions" but then TS does not get that `axis.scaleType` can't be `band` or `point`.
      return;
    }
    const scaleType = axis.scaleType ?? 'linear';
    const domainLimit = axis.domainLimit ?? 'nice';
    const axisExtremums = [axis.min ?? minData, axis.max ?? maxData];
    if (typeof domainLimit === 'function') {
      const {
        min,
        max
      } = domainLimit(minData, maxData);
      axisExtremums[0] = min;
      axisExtremums[1] = max;
    }
    const rawTickNumber = getTickNumber(_extends({}, axis, {
      range,
      domain: axisExtremums
    }));
    const tickNumber = rawTickNumber / ((zoomRange[1] - zoomRange[0]) / 100);
    const zoomedRange = zoomScaleRange(range, zoomRange);
    const scale = getScale(scaleType, axisExtremums, zoomedRange);
    const finalScale = domainLimit === 'nice' ? scale.nice(rawTickNumber) : scale;
    const [minDomain, maxDomain] = finalScale.domain();
    const domain = [axis.min ?? minDomain, axis.max ?? maxDomain];
    completeAxis[axis.id] = _extends({}, axis, {
      data,
      scaleType: scaleType,
      scale: finalScale.domain(domain),
      tickNumber,
      colorScale: axis.colorMap && getColorScale(axis.colorMap)
    });
  });
  return {
    axis: completeAxis,
    axisIds: allAxis.map(({
      id
    }) => id)
  };
}