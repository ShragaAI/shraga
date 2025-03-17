'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["x", "y", "id", "classes", "color", "shape", "dataIndex", "onClick", "skipAnimation"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import { animated, to, useSpring } from '@react-spring/web';
import { getSymbol } from "../internals/getSymbol.js";
import { InteractionContext } from "../context/InteractionProvider.js";
import { useInteractionItemProps } from "../hooks/useInteractionItemProps.js";
import { useItemHighlighted } from "../context/index.js";
import { useUtilityClasses } from "./markElementClasses.js";
import { jsx as _jsx } from "react/jsx-runtime";
const MarkElementPath = styled(animated.path, {
  name: 'MuiMarkElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState,
  theme
}) => ({
  fill: (theme.vars || theme).palette.background.paper,
  stroke: ownerState.color,
  strokeWidth: 2
}));
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [MarkElement API](https://mui.com/x/api/charts/mark-element/)
 */
function MarkElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color,
      shape,
      dataIndex,
      onClick,
      skipAnimation
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const getInteractionItemProps = useInteractionItemProps();
  const {
    isFaded,
    isHighlighted
  } = useItemHighlighted({
    seriesId: id
  });
  const {
    axis
  } = React.useContext(InteractionContext);
  const position = useSpring({
    to: {
      x,
      y
    },
    immediate: skipAnimation
  });
  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted: axis.x?.index === dataIndex || isHighlighted,
    isFaded,
    color
  };
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/_jsx(MarkElementPath, _extends({}, other, {
    style: {
      transform: to([position.x, position.y], (pX, pY) => `translate(${pX}px, ${pY}px)`),
      transformOrigin: to([position.x, position.y], (pX, pY) => `${pX}px ${pY}px`)
    },
    ownerState: ownerState
    // @ts-expect-error
    ,
    className: classes.root,
    d: d3Symbol(d3SymbolsFill[getSymbol(shape)])(),
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset'
  }, getInteractionItemProps({
    type: 'line',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? MarkElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The shape of the marker.
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool
} : void 0;
export { MarkElement };