'use client';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["rotate", "dominantBaseline"];
import * as React from 'react';
import NoSsr from '@mui/material/NoSsr';
import { useTheme, styled } from '@mui/material/styles';
import { getWordsByLines } from "../internals/getWordsByLines.js";
import { legendItemPlacements } from "./legendItemsPlacement.js";
import { useDrawingArea } from "../hooks/useDrawingArea.js";
import { ChartsLegendItem } from "./ChartsLegendItem.js";
import { createElement as _createElement } from "react";
import { jsx as _jsx } from "react/jsx-runtime";
export const ChartsLegendRoot = styled('g', {
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
  return _extends({
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
export function LegendPerItem(props) {
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
  const theme = useTheme();
  const drawingArea = useDrawingArea();
  const labelStyle = React.useMemo(() => _extends({}, theme.typography.subtitle1, {
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
    const style = _objectWithoutPropertiesLoose(inStyle, _excluded);
    const linesSize = getWordsByLines({
      style,
      needsComputation: true,
      text: label
    });
    const innerSize = {
      innerWidth: itemMarkWidth + markGap + Math.max(...linesSize.map(size => size.width)),
      innerHeight: Math.max(itemMarkHeight, linesSize.length * linesSize[0].height)
    };
    return _extends({}, innerSize, {
      outerWidth: innerSize.innerWidth + itemGap,
      outerHeight: innerSize.innerHeight + itemGap
    });
  }, [itemGap, itemMarkHeight, itemMarkWidth, markGap]);
  const totalWidth = drawingArea.left + drawingArea.width + drawingArea.right;
  const totalHeight = drawingArea.top + drawingArea.height + drawingArea.bottom;
  const availableWidth = totalWidth - padding.left - padding.right;
  const availableHeight = totalHeight - padding.top - padding.bottom;
  const [itemsWithPosition, legendWidth, legendHeight] = React.useMemo(() => legendItemPlacements(itemsToDisplay, getItemSpace, labelStyle, direction, availableWidth, availableHeight, itemGap), [itemsToDisplay, getItemSpace, labelStyle, direction, availableWidth, availableHeight, itemGap]);
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
  return /*#__PURE__*/_jsx(NoSsr, {
    children: /*#__PURE__*/_jsx(ChartsLegendRoot, {
      className: classes?.root,
      children: itemsWithPosition.map((item, i) => /*#__PURE__*/_createElement(ChartsLegendItem, _extends({}, item, {
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