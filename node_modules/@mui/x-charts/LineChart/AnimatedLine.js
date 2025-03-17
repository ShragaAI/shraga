'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["d", "skipAnimation", "ownerState"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { animated, useTransition } from '@react-spring/web';
import { color as d3Color } from '@mui/x-charts-vendor/d3-color';
import { styled } from '@mui/material/styles';
import { useStringInterpolator } from "../internals/useStringInterpolator.js";
import { AppearingMask } from "./AppearingMask.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const LineElementPath = styled(animated.path, {
  name: 'MuiLineElement',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root
})(({
  ownerState
}) => ({
  strokeWidth: 2,
  strokeLinejoin: 'round',
  fill: 'none',
  stroke: ownerState.gradientId && `url(#${ownerState.gradientId})` || ownerState.isHighlighted && d3Color(ownerState.color).brighter(0.5).formatHex() || ownerState.color,
  transition: 'opacity 0.2s ease-in, stroke 0.2s ease-in',
  opacity: ownerState.isFaded ? 0.3 : 1
}));
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [AnimatedLine API](https://mui.com/x/api/charts/animated-line/)
 */
function AnimatedLine(props) {
  const {
      d,
      skipAnimation,
      ownerState
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const stringInterpolator = useStringInterpolator(d);
  const transitionChange = useTransition([stringInterpolator], {
    from: {
      value: 0
    },
    to: {
      value: 1
    },
    enter: {
      value: 1
    },
    reset: false,
    immediate: skipAnimation
  });
  return /*#__PURE__*/_jsx(AppearingMask, {
    skipAnimation: skipAnimation,
    id: `${ownerState.id}-line-clip`,
    children: transitionChange((style, interpolator) =>
    /*#__PURE__*/
    // @ts-expect-error
    _jsx(LineElementPath, _extends({}, other, {
      ownerState: ownerState,
      d: style.value.to(interpolator)
    })))
  });
}
process.env.NODE_ENV !== "production" ? AnimatedLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  d: PropTypes.string.isRequired,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    gradientId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired
  }).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool
} : void 0;
export { AnimatedLine };