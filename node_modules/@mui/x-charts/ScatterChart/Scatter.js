'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import { getValueToPositionMapper } from "../hooks/useScale.js";
import { useInteractionItemProps } from "../hooks/useInteractionItemProps.js";
import { InteractionContext } from "../context/InteractionProvider.js";
import { useHighlighted } from "../context/index.js";
import { useDrawingArea } from "../hooks/useDrawingArea.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Demos:
 *
 * - [Scatter](https://mui.com/x/react-charts/scatter/)
 * - [Scatter demonstration](https://mui.com/x/react-charts/scatter-demo/)
 *
 * API:
 *
 * - [Scatter API](https://mui.com/x/api/charts/scatter/)
 */
function Scatter(props) {
  const {
    series,
    xScale,
    yScale,
    color,
    colorGetter,
    markerSize,
    onItemClick
  } = props;
  const drawingArea = useDrawingArea();
  const {
    useVoronoiInteraction
  } = React.useContext(InteractionContext);
  const skipInteractionHandlers = useVoronoiInteraction || series.disableHover;
  const getInteractionItemProps = useInteractionItemProps(skipInteractionHandlers);
  const {
    isFaded,
    isHighlighted
  } = useHighlighted();
  const cleanData = React.useMemo(() => {
    const getXPosition = getValueToPositionMapper(xScale);
    const getYPosition = getValueToPositionMapper(yScale);
    const temp = [];
    for (let i = 0; i < series.data.length; i += 1) {
      const scatterPoint = series.data[i];
      const x = getXPosition(scatterPoint.x);
      const y = getYPosition(scatterPoint.y);
      const isInRange = drawingArea.isPointInside({
        x,
        y
      });
      const pointCtx = {
        type: 'scatter',
        seriesId: series.id,
        dataIndex: i
      };
      if (isInRange) {
        const currentItem = {
          seriesId: pointCtx.seriesId,
          dataIndex: pointCtx.dataIndex
        };
        const isItemHighlighted = isHighlighted(currentItem);
        temp.push({
          x,
          y,
          isHighlighted: isItemHighlighted,
          isFaded: !isItemHighlighted && isFaded(currentItem),
          interactionProps: getInteractionItemProps(pointCtx),
          id: scatterPoint.id,
          dataIndex: i,
          color: colorGetter ? colorGetter(i) : color
        });
      }
    }
    return temp;
  }, [xScale, yScale, drawingArea, series.data, series.id, isHighlighted, isFaded, getInteractionItemProps, colorGetter, color]);
  return /*#__PURE__*/_jsx("g", {
    children: cleanData.map(dataPoint => /*#__PURE__*/_jsx("circle", _extends({
      cx: 0,
      cy: 0,
      r: (dataPoint.isHighlighted ? 1.2 : 1) * markerSize,
      transform: `translate(${dataPoint.x}, ${dataPoint.y})`,
      fill: dataPoint.color,
      opacity: dataPoint.isFaded && 0.3 || 1,
      onClick: onItemClick && (event => onItemClick(event, {
        type: 'scatter',
        seriesId: series.id,
        dataIndex: dataPoint.dataIndex
      })),
      cursor: onItemClick ? 'pointer' : 'unset'
    }, dataPoint.interactionProps), dataPoint.id))
  });
}
process.env.NODE_ENV !== "production" ? Scatter.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  color: PropTypes.string.isRequired,
  colorGetter: PropTypes.func,
  markerSize: PropTypes.number.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: PropTypes.func,
  series: PropTypes.object.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
} : void 0;
export { Scatter };