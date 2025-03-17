import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import clsx from 'clsx';
import { useRtl } from '@mui/system/RtlProvider';
import { ChartsText } from "../ChartsText/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props) {
  const isRTL = useRtl();
  const {
    id,
    positionY,
    label,
    positionX,
    innerHeight,
    innerWidth,
    legendWidth,
    color,
    gapX,
    gapY,
    itemMarkHeight,
    itemMarkWidth,
    markGap,
    labelStyle,
    classes,
    onClick
  } = props;
  return /*#__PURE__*/_jsxs("g", {
    className: clsx(classes?.series, `${classes?.series}-${id}`),
    transform: `translate(${gapX + (isRTL ? legendWidth - positionX : positionX)} ${gapY + positionY})`,
    children: [/*#__PURE__*/_jsx("rect", {
      x: isRTL ? -(innerWidth + 2) : -2,
      y: -itemMarkHeight / 2 - 2,
      width: innerWidth + 4,
      height: innerHeight + 4,
      fill: "transparent",
      className: classes?.itemBackground,
      onClick: onClick,
      style: {
        pointerEvents: onClick ? 'all' : 'none',
        cursor: onClick ? 'pointer' : 'unset'
      }
    }), /*#__PURE__*/_jsx("rect", {
      className: classes?.mark,
      x: isRTL ? -itemMarkWidth : 0,
      y: -itemMarkHeight / 2,
      width: itemMarkWidth,
      height: itemMarkHeight,
      fill: color,
      style: {
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/_jsx(ChartsText, {
      style: _extends({
        pointerEvents: 'none'
      }, labelStyle),
      text: label,
      x: (isRTL ? -1 : 1) * (itemMarkWidth + markGap),
      y: 0
    })]
  });
}
export { ChartsLegendItem };