"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxisEvents = void 0;
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../context/InteractionProvider");
var _CartesianProvider = require("../context/CartesianProvider");
var _isBandScale = require("../internals/isBandScale");
var _getSVGPoint = require("../internals/getSVGPoint");
var _useSvgRef = require("./useSvgRef");
var _useDrawingArea = require("./useDrawingArea");
function getAsANumber(value) {
  return value instanceof Date ? value.getTime() : value;
}
const useAxisEvents = disableAxisListener => {
  const svgRef = (0, _useSvgRef.useSvgRef)();
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const {
    dispatch
  } = React.useContext(_InteractionProvider.InteractionContext);
  const usedXAxis = xAxisIds[0];
  const usedYAxis = yAxisIds[0];

  // Use a ref to avoid rerendering on every mousemove event.
  const mousePosition = React.useRef({
    isInChart: false,
    x: -1,
    y: -1
  });
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || disableAxisListener) {
      return () => {};
    }
    function getNewAxisState(axisConfig, mouseValue) {
      const {
        scale,
        data: axisData,
        reverse
      } = axisConfig;
      if (!(0, _isBandScale.isBandScale)(scale)) {
        const value = scale.invert(mouseValue);
        if (axisData === undefined) {
          return {
            value,
            index: -1
          };
        }
        const valueAsNumber = getAsANumber(value);
        const closestIndex = axisData?.findIndex((pointValue, index) => {
          const v = getAsANumber(pointValue);
          if (v > valueAsNumber) {
            if (index === 0 || Math.abs(valueAsNumber - v) <= Math.abs(valueAsNumber - getAsANumber(axisData[index - 1]))) {
              return true;
            }
          }
          if (v <= valueAsNumber) {
            if (index === axisData.length - 1 || Math.abs(getAsANumber(value) - v) < Math.abs(getAsANumber(value) - getAsANumber(axisData[index + 1]))) {
              return true;
            }
          }
          return false;
        });
        return {
          value: closestIndex !== undefined && closestIndex >= 0 ? axisData[closestIndex] : value,
          index: closestIndex
        };
      }
      const dataIndex = scale.bandwidth() === 0 ? Math.floor((mouseValue - Math.min(...scale.range()) + scale.step() / 2) / scale.step()) : Math.floor((mouseValue - Math.min(...scale.range())) / scale.step());
      if (dataIndex < 0 || dataIndex >= axisData.length) {
        return null;
      }
      if (reverse) {
        const reverseIndex = axisData.length - 1 - dataIndex;
        return {
          index: reverseIndex,
          value: axisData[reverseIndex]
        };
      }
      return {
        index: dataIndex,
        value: axisData[dataIndex]
      };
    }
    const handleOut = () => {
      mousePosition.current = {
        isInChart: false,
        x: -1,
        y: -1
      };
      dispatch({
        type: 'exitChart'
      });
    };
    const handleMove = event => {
      const target = 'targetTouches' in event ? event.targetTouches[0] : event;
      const svgPoint = (0, _getSVGPoint.getSVGPoint)(element, target);
      mousePosition.current.x = svgPoint.x;
      mousePosition.current.y = svgPoint.y;
      if (!drawingArea.isPointInside(svgPoint, {
        targetElement: event.target
      })) {
        if (mousePosition.current.isInChart) {
          dispatch({
            type: 'exitChart'
          });
          mousePosition.current.isInChart = false;
        }
        return;
      }
      mousePosition.current.isInChart = true;
      const newStateX = getNewAxisState(xAxis[usedXAxis], svgPoint.x);
      const newStateY = getNewAxisState(yAxis[usedYAxis], svgPoint.y);
      dispatch({
        type: 'updateAxis',
        data: {
          x: newStateX,
          y: newStateY
        }
      });
    };
    const handleDown = event => {
      const target = event.currentTarget;
      if (!target) {
        return;
      }
      if (target.hasPointerCapture(event.pointerId)) {
        target.releasePointerCapture(event.pointerId);
      }
    };
    element.addEventListener('pointerdown', handleDown);
    element.addEventListener('pointermove', handleMove);
    element.addEventListener('pointerout', handleOut);
    element.addEventListener('pointercancel', handleOut);
    element.addEventListener('pointerleave', handleOut);
    return () => {
      element.removeEventListener('pointerdown', handleDown);
      element.removeEventListener('pointermove', handleMove);
      element.removeEventListener('pointerout', handleOut);
      element.removeEventListener('pointercancel', handleOut);
      element.removeEventListener('pointerleave', handleOut);
    };
  }, [svgRef, dispatch, usedYAxis, yAxis, usedXAxis, xAxis, disableAxisListener, drawingArea]);
};
exports.useAxisEvents = useAxisEvents;