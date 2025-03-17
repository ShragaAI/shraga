'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["scale", "tickNumber"];
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps, useTheme, styled } from '@mui/material/styles';
import { useRtl } from '@mui/system/RtlProvider';
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { useTicks } from "../hooks/useTicks.js";
import { useDrawingArea } from "../hooks/useDrawingArea.js";
import { AxisRoot } from "../internals/components/AxisSharedComponents.js";
import { ChartsText } from "../ChartsText/index.js";
import { getAxisUtilityClass } from "../ChartsAxis/axisClasses.js";
import { isInfinity } from "../internals/isInfinity.js";
import { isBandScale } from "../internals/isBandScale.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    position
  } = ownerState;
  const slots = {
    root: ['root', 'directionY', position],
    line: ['line'],
    tickContainer: ['tickContainer'],
    tick: ['tick'],
    tickLabel: ['tickLabel'],
    label: ['label']
  };
  return composeClasses(slots, getAxisUtilityClass, classes);
};
const YAxisRoot = styled(AxisRoot, {
  name: 'MuiChartsYAxis',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});
const defaultProps = {
  position: 'left',
  disableLine: false,
  disableTicks: false,
  tickFontSize: 12,
  labelFontSize: 14,
  tickSize: 6
};

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsYAxis API](https://mui.com/x/api/charts/charts-y-axis/)
 */
function ChartsYAxis(inProps) {
  const {
    yAxisIds,
    yAxis
  } = useCartesianContext();
  const _yAxis = yAxis[inProps.axisId ?? yAxisIds[0]],
    {
      scale: yScale,
      tickNumber
    } = _yAxis,
    settings = _objectWithoutPropertiesLoose(_yAxis, _excluded);
  const themedProps = useThemeProps({
    props: _extends({}, settings, inProps),
    name: 'MuiChartsYAxis'
  });
  const defaultizedProps = _extends({}, defaultProps, themedProps);
  const {
    position,
    disableLine,
    disableTicks,
    tickFontSize,
    label,
    labelFontSize,
    labelStyle,
    tickLabelStyle,
    tickSize: tickSizeProp,
    valueFormatter,
    slots,
    slotProps,
    tickPlacement,
    tickLabelPlacement,
    tickInterval,
    tickLabelInterval,
    sx
  } = defaultizedProps;
  const theme = useTheme();
  const isRtl = useRtl();
  const classes = useUtilityClasses(_extends({}, defaultizedProps, {
    theme
  }));
  const {
    left,
    top,
    width,
    height,
    isPointInside
  } = useDrawingArea();
  const tickSize = disableTicks ? 4 : tickSizeProp;
  const yTicks = useTicks({
    scale: yScale,
    tickNumber,
    valueFormatter,
    tickPlacement,
    tickLabelPlacement,
    tickInterval
  });
  const positionSign = position === 'right' ? 1 : -1;
  const labelRefPoint = {
    x: positionSign * (tickFontSize + tickSize + 10),
    y: top + height / 2
  };
  const Line = slots?.axisLine ?? 'line';
  const Tick = slots?.axisTick ?? 'line';
  const TickLabel = slots?.axisTickLabel ?? ChartsText;
  const Label = slots?.axisLabel ?? ChartsText;
  const revertAnchor = !isRtl && position === 'right' || isRtl && position !== 'right';
  const axisTickLabelProps = useSlotProps({
    elementType: TickLabel,
    externalSlotProps: slotProps?.axisTickLabel,
    additionalProps: {
      style: _extends({
        fontSize: tickFontSize,
        textAnchor: revertAnchor ? 'start' : 'end',
        dominantBaseline: 'central'
      }, tickLabelStyle)
    },
    className: classes.tickLabel,
    ownerState: {}
  });
  const axisLabelProps = useSlotProps({
    elementType: Label,
    externalSlotProps: slotProps?.axisLabel,
    additionalProps: {
      style: _extends({
        fontSize: labelFontSize,
        angle: positionSign * 90,
        textAnchor: 'middle',
        dominantBaseline: 'auto'
      }, labelStyle)
    },
    ownerState: {}
  });
  const lineSlotProps = useSlotProps({
    elementType: Line,
    externalSlotProps: slotProps?.axisLine,
    additionalProps: {
      strokeLinecap: 'square'
    },
    ownerState: {}
  });
  const domain = yScale.domain();
  const ordinalAxis = isBandScale(yScale);
  // Skip axis rendering if no data is available
  // - The domain is an empty array for band/point scales.
  // - The domains contains Infinity for continuous scales.
  if (ordinalAxis && domain.length === 0 || !ordinalAxis && domain.some(isInfinity)) {
    return null;
  }
  return /*#__PURE__*/_jsxs(YAxisRoot, {
    transform: `translate(${position === 'right' ? left + width : left}, 0)`,
    className: classes.root,
    sx: sx,
    children: [!disableLine && /*#__PURE__*/_jsx(Line, _extends({
      y1: top,
      y2: top + height,
      className: classes.line
    }, lineSlotProps)), yTicks.map(({
      formattedValue,
      offset,
      labelOffset,
      value
    }, index) => {
      const xTickLabel = positionSign * (tickSize + 2);
      const yTickLabel = labelOffset;
      const skipLabel = typeof tickLabelInterval === 'function' && !tickLabelInterval?.(value, index);
      const showLabel = isPointInside({
        x: -1,
        y: offset
      }, {
        direction: 'y'
      });
      if (!showLabel) {
        return null;
      }
      return /*#__PURE__*/_jsxs("g", {
        transform: `translate(0, ${offset})`,
        className: classes.tickContainer,
        children: [!disableTicks && /*#__PURE__*/_jsx(Tick, _extends({
          x2: positionSign * tickSize,
          className: classes.tick
        }, slotProps?.axisTick)), formattedValue !== undefined && !skipLabel && /*#__PURE__*/_jsx(TickLabel, _extends({
          x: xTickLabel,
          y: yTickLabel,
          text: formattedValue.toString()
        }, axisTickLabelProps))]
      }, index);
    }), label && /*#__PURE__*/_jsx("g", {
      className: classes.label,
      children: /*#__PURE__*/_jsx(Label, _extends({}, labelRefPoint, axisLabelProps, {
        text: label
      }))
    })]
  });
}
process.env.NODE_ENV !== "production" ? ChartsYAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The id of the axis to render.
   * If undefined, it will be the first defined axis.
   */
  axisId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * If true, the axis line is disabled.
   * @default false
   */
  disableLine: PropTypes.bool,
  /**
   * If true, the ticks are disabled.
   * @default false
   */
  disableTicks: PropTypes.bool,
  /**
   * The fill color of the axis text.
   * @default 'currentColor'
   */
  fill: PropTypes.string,
  /**
   * The label of the axis.
   */
  label: PropTypes.string,
  /**
   * The font size of the axis label.
   * @default 14
   * @deprecated Consider using `labelStyle.fontSize` instead.
   */
  labelFontSize: PropTypes.number,
  /**
   * The style applied to the axis label.
   */
  labelStyle: PropTypes.object,
  /**
   * Position of the axis.
   */
  position: PropTypes.oneOf(['left', 'right']),
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
  /**
   * The stroke color of the axis line.
   * @default 'currentColor'
   */
  stroke: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * The font size of the axis ticks text.
   * @default 12
   * @deprecated Consider using `tickLabelStyle.fontSize` instead.
   */
  tickFontSize: PropTypes.number,
  /**
   * Defines which ticks are displayed.
   * Its value can be:
   * - 'auto' In such case the ticks are computed based on axis scale and other parameters.
   * - a filtering function of the form `(value, index) => boolean` which is available only if the axis has "point" scale.
   * - an array containing the values where ticks should be displayed.
   * @see See {@link https://mui.com/x/react-charts/axis/#fixed-tick-positions}
   * @default 'auto'
   */
  tickInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.array, PropTypes.func]),
  /**
   * Defines which ticks get its label displayed. Its value can be:
   * - 'auto' In such case, labels are displayed if they do not overlap with the previous one.
   * - a filtering function of the form (value, index) => boolean. Warning: the index is tick index, not data ones.
   * @default 'auto'
   */
  tickLabelInterval: PropTypes.oneOfType([PropTypes.oneOf(['auto']), PropTypes.func]),
  /**
   * The placement of ticks label. Can be the middle of the band, or the tick position.
   * Only used if scale is 'band'.
   * @default 'middle'
   */
  tickLabelPlacement: PropTypes.oneOf(['middle', 'tick']),
  /**
   * The style applied to ticks text.
   */
  tickLabelStyle: PropTypes.object,
  /**
   * Maximal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMaxStep: PropTypes.number,
  /**
   * Minimal step between two ticks.
   * When using time data, the value is assumed to be in ms.
   * Not supported by categorical axis (band, points).
   */
  tickMinStep: PropTypes.number,
  /**
   * The number of ticks. This number is not guaranteed.
   * Not supported by categorical axis (band, points).
   */
  tickNumber: PropTypes.number,
  /**
   * The placement of ticks in regard to the band interval.
   * Only used if scale is 'band'.
   * @default 'extremities'
   */
  tickPlacement: PropTypes.oneOf(['end', 'extremities', 'middle', 'start']),
  /**
   * The size of the ticks.
   * @default 6
   */
  tickSize: PropTypes.number
} : void 0;
export { ChartsYAxis };