'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["x", "y", "id", "classes", "color", "dataIndex", "onClick", "skipAnimation", "shape"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { warnOnce } from '@mui/x-internals/warning';
import { animated, useSpring } from '@react-spring/web';
import { InteractionContext } from "../context/InteractionProvider.js";
import { useInteractionItemProps } from "../hooks/useInteractionItemProps.js";
import { useItemHighlighted } from "../context/index.js";
import { useUtilityClasses } from "./markElementClasses.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
function CircleMarkElement(props) {
  const {
      x,
      y,
      id,
      classes: innerClasses,
      color,
      dataIndex,
      onClick,
      skipAnimation,
      shape
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  if (shape !== 'circle') {
    warnOnce([`MUI X: The mark element of your line chart have shape "${shape}" which is not supported when using \`experimentalRendering=true\`.`, 'Only "circle" are supported with `experimentalRendering`.'].join('\n'), 'error');
  }
  const theme = useTheme();
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
  return /*#__PURE__*/_jsx(animated.circle, _extends({}, other, {
    // @ts-expect-error
    cx: position.x,
    cy: position.y,
    r: 5,
    fill: (theme.vars || theme).palette.background.paper,
    stroke: color,
    strokeWidth: 2,
    className: classes.root,
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset'
  }, getInteractionItemProps({
    type: 'line',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? CircleMarkElement.propTypes = {
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
export { CircleMarkElement };