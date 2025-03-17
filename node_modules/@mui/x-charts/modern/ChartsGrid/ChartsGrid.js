'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["vertical", "horizontal"];
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps } from '@mui/material/styles';
import { useCartesianContext } from "../context/CartesianProvider/index.js";
import { getChartsGridUtilityClass } from "./chartsGridClasses.js";
import { useDrawingArea } from "../hooks/useDrawingArea.js";
import { GridRoot } from "./styledCommonents.js";
import { ChartsGridVertical } from "./ChartsVerticalGrid.js";
import { ChartsGridHorizontal } from "./ChartsHorizontalGrid.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const useUtilityClasses = ({
  classes
}) => {
  const slots = {
    root: ['root'],
    verticalLine: ['line', 'verticalLine'],
    horizontalLine: ['line', 'horizontalLine']
  };
  return composeClasses(slots, getChartsGridUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsGrid API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsGrid(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiChartsGrid'
  });
  const drawingArea = useDrawingArea();
  const {
      vertical,
      horizontal
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const {
    xAxis,
    xAxisIds,
    yAxis,
    yAxisIds
  } = useCartesianContext();
  const classes = useUtilityClasses(props);
  const horizontalAxis = yAxis[yAxisIds[0]];
  const verticalAxis = xAxis[xAxisIds[0]];
  return /*#__PURE__*/_jsxs(GridRoot, _extends({}, other, {
    className: classes.root,
    children: [vertical && /*#__PURE__*/_jsx(ChartsGridVertical, {
      axis: verticalAxis,
      drawingArea: drawingArea,
      classes: classes
    }), horizontal && /*#__PURE__*/_jsx(ChartsGridHorizontal, {
      axis: horizontalAxis,
      drawingArea: drawingArea,
      classes: classes
    })]
  }));
}
process.env.NODE_ENV !== "production" ? ChartsGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Displays horizontal grid.
   */
  horizontal: PropTypes.bool,
  /**
   * Displays vertical grid.
   */
  vertical: PropTypes.bool
} : void 0;
export { ChartsGrid };