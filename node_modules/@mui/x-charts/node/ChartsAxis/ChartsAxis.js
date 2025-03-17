"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxis = ChartsAxis;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _CartesianProvider = require("../context/CartesianProvider");
var _ChartsXAxis = require("../ChartsXAxis");
var _ChartsYAxis = require("../ChartsYAxis");
var _jsxRuntime = require("react/jsx-runtime");
const getAxisId = (propsValue, defaultAxisId) => {
  if (propsValue == null) {
    return null;
  }
  if (typeof propsValue === 'object') {
    return propsValue.axisId ?? defaultAxisId ?? null;
  }
  return propsValue;
};
const mergeProps = (axisConfig, slots, slotProps) => {
  return typeof axisConfig === 'object' ? (0, _extends2.default)({}, axisConfig, {
    slots: (0, _extends2.default)({}, slots, axisConfig?.slots),
    slotProps: (0, _extends2.default)({}, slotProps, axisConfig?.slotProps)
  }) : {
    slots,
    slotProps
  };
};

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsAxis(props) {
  const {
    topAxis,
    leftAxis,
    rightAxis,
    bottomAxis,
    slots,
    slotProps
  } = props;
  const {
    xAxis,
    xAxisIds,
    yAxis,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();

  // TODO: use for plotting line without ticks or any thing
  // const drawingArea = React.useContext(DrawingContext);

  const leftId = getAxisId(leftAxis === undefined ? yAxisIds[0] : leftAxis, yAxisIds[0]);
  const bottomId = getAxisId(bottomAxis === undefined ? xAxisIds[0] : bottomAxis, xAxisIds[0]);
  const topId = getAxisId(topAxis, xAxisIds[0]);
  const rightId = getAxisId(rightAxis, yAxisIds[0]);
  if (topId !== null && !xAxis[topId]) {
    throw new Error([`MUI X: id used for top axis "${topId}" is not defined.`, `Available ids are: ${xAxisIds.join(', ')}.`].join('\n'));
  }
  if (leftId !== null && !yAxis[leftId]) {
    throw new Error([`MUI X: id used for left axis "${leftId}" is not defined.`, `Available ids are: ${yAxisIds.join(', ')}.`].join('\n'));
  }
  if (rightId !== null && !yAxis[rightId]) {
    throw new Error([`MUI X: id used for right axis "${rightId}" is not defined.`, `Available ids are: ${yAxisIds.join(', ')}.`].join('\n'));
  }
  if (bottomId !== null && !xAxis[bottomId]) {
    throw new Error([`MUI X: id used for bottom axis "${bottomId}" is not defined.`, `Available ids are: ${xAxisIds.join(', ')}.`].join('\n'));
  }
  const topAxisProps = mergeProps(topAxis, slots, slotProps);
  const bottomAxisProps = mergeProps(bottomAxis, slots, slotProps);
  const leftAxisProps = mergeProps(leftAxis, slots, slotProps);
  const rightAxisProps = mergeProps(rightAxis, slots, slotProps);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [topId && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsXAxis.ChartsXAxis, (0, _extends2.default)({}, topAxisProps, {
      position: "top",
      axisId: topId
    })), bottomId && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsXAxis.ChartsXAxis, (0, _extends2.default)({}, bottomAxisProps, {
      position: "bottom",
      axisId: bottomId
    })), leftId && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsYAxis.ChartsYAxis, (0, _extends2.default)({}, leftAxisProps, {
      position: "left",
      axisId: leftId
    })), rightId && /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsYAxis.ChartsYAxis, (0, _extends2.default)({}, rightAxisProps, {
      position: "right",
      axisId: rightId
    }))]
  });
}
process.env.NODE_ENV !== "production" ? ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Indicate which axis to display the bottom of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default xAxisIds[0] The id of the first provided axis
   */
  bottomAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  /**
   * Indicate which axis to display the left of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default yAxisIds[0] The id of the first provided axis
   */
  leftAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  /**
   * Indicate which axis to display the right of the charts.
   * Can be a string (the id of the axis) or an object `ChartsYAxisProps`.
   * @default null
   */
  rightAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string]),
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object,
  /**
   * Indicate which axis to display the top of the charts.
   * Can be a string (the id of the axis) or an object `ChartsXAxisProps`.
   * @default null
   */
  topAxis: _propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.string])
} : void 0;