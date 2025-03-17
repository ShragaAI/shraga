'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["classes", "color", "cornerRadius", "dataIndex", "endAngle", "id", "innerRadius", "isFaded", "isHighlighted", "onClick", "outerRadius", "paddingAngle", "startAngle", "highlightScope"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { animated, to } from '@react-spring/web';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useInteractionItemProps } from "../hooks/useInteractionItemProps.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function getPieArcUtilityClass(slot) {
  return generateUtilityClass('MuiPieArc', slot);
}
export const pieArcClasses = generateUtilityClasses('MuiPieArc', ['root', 'highlighted', 'faded']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted,
    dataIndex
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, `data-index-${dataIndex}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return composeClasses(slots, getPieArcUtilityClass, classes);
};
const PieArcRoot = styled(animated.path, {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc
})(({
  theme
}) => ({
  // Got to move stroke to an element prop instead of style.
  stroke: (theme.vars || theme).palette.background.paper,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, filter 0.2s ease-in'
}));
function PieArc(props) {
  const {
      classes: innerClasses,
      color,
      cornerRadius,
      dataIndex,
      endAngle,
      id,
      innerRadius,
      isFaded,
      isHighlighted,
      onClick,
      outerRadius,
      paddingAngle,
      startAngle
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted
  };
  const classes = useUtilityClasses(ownerState);
  const getInteractionItemProps = useInteractionItemProps();
  return /*#__PURE__*/_jsx(PieArcRoot, _extends({
    d: to([startAngle, endAngle, paddingAngle, innerRadius, outerRadius, cornerRadius], (sA, eA, pA, iR, oR, cR) => d3Arc().cornerRadius(cR)({
      padAngle: pA,
      startAngle: sA,
      endAngle: eA,
      innerRadius: iR,
      outerRadius: oR
    })),
    visibility: to([startAngle, endAngle], (sA, eA) => sA === eA ? 'hidden' : 'visible')
    // @ts-expect-error
    ,
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset',
    ownerState: ownerState,
    className: classes.root,
    fill: ownerState.color,
    opacity: ownerState.isFaded ? 0.3 : 1,
    filter: ownerState.isHighlighted ? 'brightness(120%)' : 'none',
    strokeWidth: 1,
    strokeLinejoin: "round"
  }, other, getInteractionItemProps({
    type: 'pie',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  /**
   * @deprecated Use the `isFaded` or `isHighlighted` props instead.
   */
  highlightScope: PropTypes.shape({
    fade: PropTypes.oneOf(['global', 'none', 'series']),
    faded: PropTypes.oneOf(['global', 'none', 'series']),
    highlight: PropTypes.oneOf(['item', 'none', 'series']),
    highlighted: PropTypes.oneOf(['item', 'none', 'series'])
  }),
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired
} : void 0;
export { PieArc };