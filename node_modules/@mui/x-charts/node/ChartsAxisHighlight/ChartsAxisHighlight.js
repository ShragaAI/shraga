"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxisHighlight = ChartsAxisHighlight;
exports.chartsAxisHighlightClasses = exports.ChartsAxisHighlightPath = void 0;
exports.getAxisHighlightUtilityClass = getAxisHighlightUtilityClass;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _styles = require("@mui/material/styles");
var _InteractionProvider = require("../context/InteractionProvider");
var _CartesianProvider = require("../context/CartesianProvider");
var _useScale = require("../hooks/useScale");
var _isBandScale = require("../internals/isBandScale");
var _jsxRuntime = require("react/jsx-runtime");
function getAxisHighlightUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsAxisHighlight', slot);
}
const chartsAxisHighlightClasses = exports.chartsAxisHighlightClasses = (0, _generateUtilityClasses.default)('MuiChartsAxisHighlight', ['root']);
const useUtilityClasses = () => {
  const slots = {
    root: ['root']
  };
  return (0, _composeClasses.default)(slots, getAxisHighlightUtilityClass);
};
const ChartsAxisHighlightPath = exports.ChartsAxisHighlightPath = (0, _styles.styled)('path', {
  name: 'MuiChartsAxisHighlight',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  theme
}) => ({
  pointerEvents: 'none',
  variants: [{
    props: {
      axisHighlight: 'band'
    },
    style: (0, _extends2.default)({
      fill: 'white',
      fillOpacity: 0.1
    }, theme.applyStyles('light', {
      fill: 'gray'
    }))
  }, {
    props: {
      axisHighlight: 'line'
    },
    style: (0, _extends2.default)({
      strokeDasharray: '5 2',
      stroke: '#ffffff'
    }, theme.applyStyles('light', {
      stroke: '#000000'
    }))
  }]
}));
/**
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisHighlight API](https://mui.com/x/api/charts/charts-axis-highlight/)
 */
function ChartsAxisHighlight(props) {
  const {
    x: xAxisHighlight,
    y: yAxisHighlight
  } = props;
  const {
    xAxisIds,
    xAxis,
    yAxisIds,
    yAxis
  } = (0, _CartesianProvider.useCartesianContext)();
  const classes = useUtilityClasses();
  const USED_X_AXIS_ID = xAxisIds[0];
  const USED_Y_AXIS_ID = yAxisIds[0];
  const xScale = xAxis[USED_X_AXIS_ID].scale;
  const yScale = yAxis[USED_Y_AXIS_ID].scale;
  const {
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const getXPosition = (0, _useScale.getValueToPositionMapper)(xScale);
  const getYPosition = (0, _useScale.getValueToPositionMapper)(yScale);
  const axisX = axis.x;
  const axisY = axis.y;
  const isBandScaleX = xAxisHighlight === 'band' && axisX !== null && (0, _isBandScale.isBandScale)(xScale);
  const isBandScaleY = yAxisHighlight === 'band' && axisY !== null && (0, _isBandScale.isBandScale)(yScale);
  if (process.env.NODE_ENV !== 'production') {
    const isXError = isBandScaleX && xScale(axisX.value) === undefined;
    const isYError = isBandScaleY && yScale(axisY.value) === undefined;
    if (isXError || isYError) {
      console.error([`MUI X: The position value provided for the axis is not valid for the current scale.`, `This probably means something is wrong with the data passed to the chart.`, `The ChartsAxisHighlight component will not be displayed.`].join('\n'));
    }
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [isBandScaleX && xScale(axisX.value) !== undefined && /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsAxisHighlightPath
    // @ts-expect-error, xScale value is checked in the statement above
    , {
      d: `M ${xScale(axisX.value) - (xScale.step() - xScale.bandwidth()) / 2} ${yScale.range()[0]} l ${xScale.step()} 0 l 0 ${yScale.range()[1] - yScale.range()[0]} l ${-xScale.step()} 0 Z`,
      className: classes.root,
      ownerState: {
        axisHighlight: 'band'
      }
    }), isBandScaleY && yScale(axisY.value) !== undefined && /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsAxisHighlightPath, {
      d: `M ${xScale.range()[0]} ${
      // @ts-expect-error, yScale value is checked in the statement above
      yScale(axisY.value) - (yScale.step() - yScale.bandwidth()) / 2} l 0 ${yScale.step()} l ${xScale.range()[1] - xScale.range()[0]} 0 l 0 ${-yScale.step()} Z`,
      className: classes.root,
      ownerState: {
        axisHighlight: 'band'
      }
    }), xAxisHighlight === 'line' && axis.x !== null && /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsAxisHighlightPath, {
      d: `M ${getXPosition(axis.x.value)} ${yScale.range()[0]} L ${getXPosition(axis.x.value)} ${yScale.range()[1]}`,
      className: classes.root,
      ownerState: {
        axisHighlight: 'line'
      }
    }), yAxisHighlight === 'line' && axis.y !== null && /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsAxisHighlightPath, {
      d: `M ${xScale.range()[0]} ${getYPosition(axis.y.value)} L ${xScale.range()[1]} ${getYPosition(axis.y.value)}`,
      className: classes.root,
      ownerState: {
        axisHighlight: 'line'
      }
    })]
  });
}
process.env.NODE_ENV !== "production" ? ChartsAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  x: _propTypes.default.oneOf(['band', 'line', 'none']),
  y: _propTypes.default.oneOf(['band', 'line', 'none'])
} : void 0;