"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContinuousColorLegend = ContinuousColorLegend;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _RtlProvider = require("@mui/system/RtlProvider");
var _ChartsContinuousGradient = _interopRequireDefault(require("../internals/components/ChartsAxesGradients/ChartsContinuousGradient"));
var _hooks = require("../hooks");
var _getScale = require("../internals/getScale");
var _getPercentageValue = require("../internals/getPercentageValue");
var _ChartsText = require("../ChartsText");
var _domUtils = require("../internals/domUtils");
var _useAxis = require("./useAxis");
var _jsxRuntime = require("react/jsx-runtime");
function getPositionOffset(position, legendBox, svgBox) {
  let offsetX = 0;
  let offsetY = 0;
  switch (position.horizontal) {
    case 'left':
      offsetX = 0;
      break;
    case 'middle':
      offsetX = (svgBox.width - legendBox.width) / 2;
      break;
    case 'right':
    default:
      offsetX = svgBox.width - legendBox.width;
      break;
  }
  switch (position.vertical) {
    case 'top':
      offsetY = 0;
      break;
    case 'middle':
      offsetY = (svgBox.height - legendBox.height) / 2;
      break;
    case 'bottom':
    default:
      offsetY = svgBox.height - legendBox.height;
      break;
  }
  return {
    offsetX,
    offsetY
  };
}

/**
 * Takes placement parameters and element bounding boxes.
 * Returns the x, y coordinates of the elements. And the textAnchor, dominantBaseline for texts.
 */
function getElementPositions(text1Box, barBox, text2Box, params) {
  if (params.direction === 'column') {
    const text1 = {
      y: text1Box.height,
      dominantBaseline: 'auto'
    };
    const text2 = {
      y: text1Box.height + 2 * params.spacing + barBox.height,
      dominantBaseline: 'hanging'
    };
    const bar = {
      y: text1Box.height + params.spacing
    };
    const totalWidth = Math.max(text1Box.width, barBox.width, text2Box.width);
    const totalHeight = text1Box.height + barBox.height + text2Box.height + 2 * params.spacing;
    const boundingBox = {
      width: totalWidth,
      height: totalHeight
    };
    switch (params.align) {
      case 'start':
        return {
          text1: (0, _extends2.default)({}, text1, {
            textAnchor: 'start',
            x: 0
          }),
          text2: (0, _extends2.default)({}, text2, {
            textAnchor: 'start',
            x: 0
          }),
          bar: (0, _extends2.default)({}, bar, {
            x: 0
          }),
          boundingBox
        };
      case 'end':
        return {
          text1: (0, _extends2.default)({}, text1, {
            textAnchor: 'end',
            x: totalWidth
          }),
          text2: (0, _extends2.default)({}, text2, {
            textAnchor: 'end',
            x: totalWidth
          }),
          bar: (0, _extends2.default)({}, bar, {
            x: totalWidth - barBox.width
          }),
          boundingBox
        };
      case 'middle':
      default:
        return {
          text1: (0, _extends2.default)({}, text1, {
            textAnchor: 'middle',
            x: totalWidth / 2
          }),
          text2: (0, _extends2.default)({}, text2, {
            textAnchor: 'middle',
            x: totalWidth / 2
          }),
          bar: (0, _extends2.default)({}, bar, {
            x: totalWidth / 2 - barBox.width / 2
          }),
          boundingBox
        };
    }
  } else {
    const text1 = {
      x: text1Box.width,
      textAnchor: 'end'
    };
    const text2 = {
      x: text1Box.width + 2 * params.spacing + barBox.width,
      textAnchor: 'start'
    };
    const bar = {
      x: text1Box.width + params.spacing
    };
    const totalHeight = Math.max(text1Box.height, barBox.height, text2Box.height);
    const totalWidth = text1Box.width + barBox.width + text2Box.width + 2 * params.spacing;
    const boundingBox = {
      width: totalWidth,
      height: totalHeight
    };
    switch (params.align) {
      case 'start':
        return {
          text1: (0, _extends2.default)({}, text1, {
            dominantBaseline: 'hanging',
            y: 0
          }),
          text2: (0, _extends2.default)({}, text2, {
            dominantBaseline: 'hanging',
            y: 0
          }),
          bar: (0, _extends2.default)({}, bar, {
            y: 0
          }),
          boundingBox
        };
      case 'end':
        return {
          text1: (0, _extends2.default)({}, text1, {
            dominantBaseline: 'auto',
            y: totalHeight
          }),
          text2: (0, _extends2.default)({}, text2, {
            dominantBaseline: 'auto',
            y: totalHeight
          }),
          bar: (0, _extends2.default)({}, bar, {
            y: totalHeight - barBox.height
          }),
          boundingBox
        };
      case 'middle':
      default:
        return {
          text1: (0, _extends2.default)({}, text1, {
            dominantBaseline: 'central',
            y: totalHeight / 2
          }),
          text2: (0, _extends2.default)({}, text2, {
            dominantBaseline: 'central',
            y: totalHeight / 2
          }),
          bar: (0, _extends2.default)({}, bar, {
            y: totalHeight / 2 - barBox.height / 2
          }),
          boundingBox
        };
    }
  }
}
const defaultLabelFormatter = ({
  formattedValue
}) => formattedValue;
function ContinuousColorLegend(props) {
  const theme = (0, _styles.useTheme)();
  const isRtl = (0, _RtlProvider.useRtl)();
  const {
    id: idProp,
    minLabel = defaultLabelFormatter,
    maxLabel = defaultLabelFormatter,
    scaleType = 'linear',
    direction,
    length = '50%',
    thickness = 5,
    spacing = 4,
    align = 'middle',
    labelStyle = theme.typography.subtitle1,
    position,
    axisDirection,
    axisId
  } = props;
  const chartId = (0, _hooks.useChartId)();
  const id = idProp ?? `gradient-legend-${chartId}`;
  const axisItem = (0, _useAxis.useAxis)({
    axisDirection,
    axisId
  });
  const {
    width,
    height,
    left,
    right,
    top,
    bottom
  } = (0, _hooks.useDrawingArea)();
  const refLength = direction === 'column' ? height + top + bottom : width + left + right;
  const size = (0, _getPercentageValue.getPercentageValue)(length, refLength);
  const isReversed = direction === 'column';
  const colorMap = axisItem?.colorMap;
  if (!colorMap || !colorMap.type || colorMap.type !== 'continuous') {
    return null;
  }

  // Define the coordinate to color mapping

  const colorScale = axisItem.colorScale;
  const minValue = colorMap.min ?? 0;
  const maxValue = colorMap.max ?? 100;
  const scale = (0, _getScale.getScale)(scaleType, [minValue, maxValue], isReversed ? [size, 0] : [0, size]);

  // Get texts to display

  const formattedMin = axisItem.valueFormatter?.(minValue, {
    location: 'legend'
  }) ?? minValue.toLocaleString();
  const formattedMax = axisItem.valueFormatter?.(maxValue, {
    location: 'legend'
  }) ?? maxValue.toLocaleString();
  const minText = typeof minLabel === 'string' ? minLabel : minLabel({
    value: minValue ?? 0,
    formattedValue: formattedMin
  });
  const maxText = typeof maxLabel === 'string' ? maxLabel : maxLabel({
    value: maxValue ?? 0,
    formattedValue: formattedMax
  });
  const text1 = isReversed ? maxText : minText;
  const text2 = isReversed ? minText : maxText;
  const text1Box = (0, _domUtils.getStringSize)(text1, (0, _extends2.default)({}, labelStyle));
  const text2Box = (0, _domUtils.getStringSize)(text2, (0, _extends2.default)({}, labelStyle));

  // Place bar and texts

  const barBox = direction === 'column' || isRtl && direction === 'row' ? {
    width: thickness,
    height: size
  } : {
    width: size,
    height: thickness
  };
  const legendPositions = getElementPositions(text1Box, barBox, text2Box, {
    spacing,
    align,
    direction
  });
  const svgBoundingBox = {
    width: width + left + right,
    height: height + top + bottom
  };
  const positionOffset = getPositionOffset((0, _extends2.default)({
    horizontal: 'middle',
    vertical: 'top'
  }, position), legendPositions.boundingBox, svgBoundingBox);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradient.default, {
      isReversed: isReversed,
      gradientId: id,
      size: size,
      direction: direction === 'row' ? 'x' : 'y',
      scale: scale,
      colorScale: colorScale,
      colorMap: colorMap,
      gradientUnits: "objectBoundingBox"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsText.ChartsText, {
      text: text1,
      x: positionOffset.offsetX + legendPositions.text1.x,
      y: positionOffset.offsetY + legendPositions.text1.y,
      style: (0, _extends2.default)({
        dominantBaseline: legendPositions.text1.dominantBaseline,
        textAnchor: legendPositions.text1.textAnchor
      }, labelStyle)
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", (0, _extends2.default)({
      x: positionOffset.offsetX + legendPositions.bar.x,
      y: positionOffset.offsetY + legendPositions.bar.y
    }, barBox, {
      fill: `url(#${id})`
    })), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsText.ChartsText, {
      text: text2,
      x: positionOffset.offsetX + legendPositions.text2.x,
      y: positionOffset.offsetY + legendPositions.text2.y,
      style: (0, _extends2.default)({
        dominantBaseline: legendPositions.text2.dominantBaseline,
        textAnchor: legendPositions.text2.textAnchor
      }, labelStyle)
    })]
  });
}
process.env.NODE_ENV !== "production" ? ContinuousColorLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The alignment of the texts with the gradient bar.
   * @default 'middle'
   */
  align: _propTypes.default.oneOf(['end', 'middle', 'start']),
  /**
   * The axis direction containing the color configuration to represent.
   * @default 'z'
   */
  axisDirection: _propTypes.default.oneOf(['x', 'y', 'z']),
  /**
   * The id of the axis item with the color configuration to represent.
   * @default The first axis item.
   */
  axisId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: _propTypes.default.oneOf(['column', 'row']),
  /**
   * A unique identifier for the gradient.
   * @default auto-generated id
   */
  id: _propTypes.default.string,
  /**
   * The style applied to labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: _propTypes.default.object,
  /**
   * The length of the gradient bar.
   * Can be a number (in px) or a string with a percentage such as '50%'.
   * The '100%' is the length of the svg.
   * @default '50%'
   */
  length: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  /**
   * The label to display at the maximum side of the gradient.
   * Can either be a string, or a function.
   * If not defined, the formatted maximal value is display.
   * @default ({ formattedValue }) => formattedValue
   */
  maxLabel: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  /**
   * The label to display at the minimum side of the gradient.
   * Can either be a string, or a function.
   * @default ({ formattedValue }) => formattedValue
   */
  minLabel: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
  /**
   * The position of the legend.
   */
  position: _propTypes.default.shape({
    horizontal: _propTypes.default.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: _propTypes.default.oneOf(['bottom', 'middle', 'top']).isRequired
  }),
  /**
   * The scale used to display gradient colors.
   * @default 'linear'
   */
  scaleType: _propTypes.default.oneOf(['linear', 'log', 'pow', 'sqrt', 'time', 'utc']),
  /**
   * The space between the gradient bar and the labels.
   * @default 4
   */
  spacing: _propTypes.default.number,
  /**
   * The thickness of the gradient bar.
   * @default 5
   */
  thickness: _propTypes.default.number
} : void 0;