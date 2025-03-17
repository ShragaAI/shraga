'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled, useThemeProps } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import NoSsr from '@mui/material/NoSsr';
import useSlotProps from '@mui/utils/useSlotProps';
import { InteractionContext } from "../context/InteractionProvider.js";
import { generateVirtualElement, useMouseTracker, getTooltipHasData } from "./utils.js";
import { ChartsItemTooltipContent } from "./ChartsItemTooltipContent.js";
import { ChartsAxisTooltipContent } from "./ChartsAxisTooltipContent.js";
import { getChartsTooltipUtilityClass } from "./chartsTooltipClasses.js";
import { jsx as _jsx } from "react/jsx-runtime";
const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell']
  };
  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};
const ChartsTooltipRoot = styled(Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  theme
}) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal
}));

/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltip(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiChartsTooltip'
  });
  const {
    trigger = 'axis',
    itemContent,
    axisContent,
    slots,
    slotProps
  } = props;
  const mousePosition = useMouseTracker();
  const {
    item,
    axis
  } = React.useContext(InteractionContext);
  const displayedData = trigger === 'item' ? item : axis;
  const tooltipHasData = getTooltipHasData(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;
  const classes = useUtilityClasses({
    classes: props.classes
  });
  const PopperComponent = slots?.popper ?? ChartsTooltipRoot;
  const popperProps = useSlotProps({
    elementType: PopperComponent,
    externalSlotProps: slotProps?.popper,
    additionalProps: {
      open: popperOpen,
      placement: mousePosition?.pointerType === 'mouse' ? 'right-start' : 'top',
      anchorEl: generateVirtualElement(mousePosition),
      modifiers: [{
        name: 'offset',
        options: {
          offset: [0, mousePosition?.pointerType === 'touch' ? 40 - mousePosition.height : 0]
        }
      }]
    },
    ownerState: {}
  });
  if (trigger === 'none') {
    return null;
  }
  return /*#__PURE__*/_jsx(NoSsr, {
    children: popperOpen && /*#__PURE__*/_jsx(PopperComponent, _extends({}, popperProps, {
      className: classes.root,
      children: trigger === 'item' ? /*#__PURE__*/_jsx(ChartsItemTooltipContent, {
        itemData: displayedData,
        content: slots?.itemContent ?? itemContent,
        contentProps: slotProps?.itemContent,
        sx: {
          mx: 2
        },
        classes: classes
      }) : /*#__PURE__*/_jsx(ChartsAxisTooltipContent, {
        axisData: displayedData,
        content: slots?.axisContent ?? axisContent,
        contentProps: slotProps?.axisContent,
        sx: {
          mx: 2
        },
        classes: classes
      })
    }))
  });
}
process.env.NODE_ENV !== "production" ? ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when trigger is set to 'axis'.
   * @deprecated Use slots.axisContent instead
   */
  axisContent: PropTypes.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Component to override the tooltip content when trigger is set to 'item'.
   * @deprecated Use slots.itemContent instead
   */
  itemContent: PropTypes.elementType,
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
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'axis'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none'])
} : void 0;
export { ChartsTooltip };