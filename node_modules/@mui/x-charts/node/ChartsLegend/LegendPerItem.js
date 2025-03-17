"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLegendRoot = void 0;
exports.LegendPerItem = LegendPerItem;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _NoSsr = _interopRequireDefault(require("@mui/material/NoSsr"));
var _styles = require("@mui/material/styles");
var _getWordsByLines = require("../internals/getWordsByLines");
var _legendItemsPlacement = require("./legendItemsPlacement");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _ChartsLegendItem = require("./ChartsLegendItem");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["rotate", "dominantBaseline"];
const ChartsLegendRoot = exports.ChartsLegendRoot = (0, _styles.styled)('g', {
  name: 'MuiChartsLegend',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root
})({});
/**
 * Transforms number or partial padding object to a defaultized padding object.
 */
const getStandardizedPadding = padding => {
  if (typeof padding === 'number') {
    return {
      left: padding,
      right: padding,
      top: padding,
      bottom: padding
    };
  }
  return (0, _extends2.default)({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, padding);
};

/**
 * Internal component to display an array of items as a legend.
 * Used for series legend, and threshold color legend.
 * @ignore - Do not document
 */
function LegendPerItem(props) {
  const {
    position,
    direction,
    itemsToDisplay,
    classes,
    itemMarkWidth = 20,
    itemMarkHeight = 20,
    markGap = 5,
    itemGap = 10,
    padding: paddingProps = 10,
    labelStyle: inLabelStyle,
    onItemClick
  } = props;
  const theme = (0, _styles.useTheme)();
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const labelStyle = React.useMemo(() => (0, _extends2.default)({}, theme.typography.subtitle1, {
    color: 'inherit',
    dominantBaseline: 'central',
    textAnchor: 'start',
    fill: (theme.vars || theme).palette.text.primary,
    lineHeight: 1
  }, inLabelStyle),
  // To say to TS that the dominantBaseline and textAnchor are correct
  [inLabelStyle, theme]);
  const padding = React.useMemo(() => getStandardizedPadding(paddingProps), [paddingProps]);
  const getItemSpace = React.useCallback((label, inStyle = {}) => {
    const style = (0, _objectWithoutPropertiesLoose2.default)(inStyle, _excluded);
    const linesSize = (0, _getWordsByLines.getWordsByLines)({
      style,
      needsComputation: true,
      text: label
    });
    const innerSize = {
      innerWidth: itemMarkWidth + markGap + Math.max(...linesSize.map(size => size.width)),
      innerHeight: Math.max(itemMarkHeight, linesSize.length * linesSize[0].height)
    };
    return (0, _extends2.default)({}, innerSize, {
      outerWidth: innerSize.innerWidth + itemGap,
      outerHeight: innerSize.innerHeight + itemGap
    });
  }, [itemGap, itemMarkHeight, itemMarkWidth, markGap]);
  const totalWidth = drawingArea.left + drawingArea.width + drawingArea.right;
  const totalHeight = drawingArea.top + drawingArea.height + drawingArea.bottom;
  const availableWidth = totalWidth - padding.left - padding.right;
  const availableHeight = totalHeight - padding.top - padding.bottom;
  const [itemsWithPosition, legendWidth, legendHeight] = React.useMemo(() => (0, _legendItemsPlacement.legendItemPlacements)(itemsToDisplay, getItemSpace, labelStyle, direction, availableWidth, availableHeight, itemGap), [itemsToDisplay, getItemSpace, labelStyle, direction, availableWidth, availableHeight, itemGap]);
  const gapX = React.useMemo(() => {
    switch (position.horizontal) {
      case 'left':
        return padding.left;
      case 'right':
        return totalWidth - padding.right - legendWidth;
      default:
        return (totalWidth - legendWidth) / 2;
    }
  }, [position.horizontal, padding.left, padding.right, totalWidth, legendWidth]);
  const gapY = React.useMemo(() => {
    switch (position.vertical) {
      case 'top':
        return padding.top;
      case 'bottom':
        return totalHeight - padding.bottom - legendHeight;
      default:
        return (totalHeight - legendHeight) / 2;
    }
  }, [position.vertical, padding.top, padding.bottom, totalHeight, legendHeight]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_NoSsr.default, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsLegendRoot, {
      className: classes?.root,
      children: itemsWithPosition.map((item, i) => /*#__PURE__*/(0, _react.createElement)(_ChartsLegendItem.ChartsLegendItem, (0, _extends2.default)({}, item, {
        key: item.id,
        gapX: gapX,
        gapY: gapY,
        legendWidth: legendWidth,
        itemMarkHeight: itemMarkHeight,
        itemMarkWidth: itemMarkWidth,
        markGap: markGap,
        labelStyle: labelStyle,
        classes: classes,
        onClick: onItemClick ? event => onItemClick(event, i) : undefined
      })))
    })
  });
}