'use client';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["slots", "slotProps"];
import * as React from 'react';
import PropTypes from 'prop-types';
import useSlotProps from '@mui/utils/useSlotProps';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps, useTheme } from '@mui/material/styles';
import { getSeriesToDisplay } from "./utils.js";
import { getLegendUtilityClass } from "./chartsLegendClasses.js";
import { DefaultChartsLegend } from "./DefaultChartsLegend.js";
import { useDrawingArea } from "../hooks/index.js";
import { useSeries } from "../hooks/useSeries.js";
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes,
    direction
  } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
    itemBackground: ['itemBackground']
  };
  return composeClasses(slots, getLegendUtilityClass, classes);
};
function ChartsLegend(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiChartsLegend'
  });
  const defaultizedProps = _extends({
    direction: 'row'
  }, props, {
    position: _extends({
      horizontal: 'middle',
      vertical: 'top'
    }, props.position)
  });
  const {
      slots,
      slotProps
    } = defaultizedProps,
    other = _objectWithoutPropertiesLoose(defaultizedProps, _excluded);
  const theme = useTheme();
  const classes = useUtilityClasses(_extends({}, defaultizedProps, {
    theme
  }));
  const drawingArea = useDrawingArea();
  const series = useSeries();
  const seriesToDisplay = getSeriesToDisplay(series);
  const ChartLegendRender = slots?.legend ?? DefaultChartsLegend;
  const chartLegendRenderProps = useSlotProps({
    elementType: ChartLegendRender,
    externalSlotProps: slotProps?.legend,
    additionalProps: _extends({}, other, {
      classes,
      drawingArea,
      series,
      seriesToDisplay
    }),
    ownerState: {}
  });
  return /*#__PURE__*/_jsx(ChartLegendRender, _extends({}, chartLegendRenderProps));
}
process.env.NODE_ENV !== "production" ? ChartsLegend.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The direction of the legend layout.
   * The default depends on the chart.
   */
  direction: PropTypes.oneOf(['column', 'row']),
  /**
   * Set to true to hide the legend.
   * @default false
   */
  hidden: PropTypes.bool,
  /**
   * Space between two legend items (in px).
   * @default 10
   */
  itemGap: PropTypes.number,
  /**
   * Height of the item mark (in px).
   * @default 20
   */
  itemMarkHeight: PropTypes.number,
  /**
   * Width of the item mark (in px).
   * @default 20
   */
  itemMarkWidth: PropTypes.number,
  /**
   * Style applied to legend labels.
   * @default theme.typography.subtitle1
   */
  labelStyle: PropTypes.object,
  /**
   * Space between the mark and the label (in px).
   * @default 5
   */
  markGap: PropTypes.number,
  /**
   * Callback fired when a legend item is clicked.
   * @param {React.MouseEvent<SVGRectElement, MouseEvent>} event The click event.
   * @param {SeriesLegendItemContext} legendItem The legend item data.
   * @param {number} index The index of the clicked legend item.
   */
  onItemClick: PropTypes.func,
  /**
   * Legend padding (in px).
   * Can either be a single number, or an object with top, left, bottom, right properties.
   * @default 10
   */
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number
  })]),
  /**
   * The position of the legend.
   */
  position: PropTypes.shape({
    horizontal: PropTypes.oneOf(['left', 'middle', 'right']).isRequired,
    vertical: PropTypes.oneOf(['bottom', 'middle', 'top']).isRequired
  }),
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
export { ChartsLegend };