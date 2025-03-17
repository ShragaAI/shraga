"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsVoronoiHandler = ChartsVoronoiHandler;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _d3Delaunay = require("@mui/x-charts-vendor/d3-delaunay");
var _useEnhancedEffect = _interopRequireDefault(require("@mui/utils/useEnhancedEffect"));
var _InteractionProvider = require("../context/InteractionProvider");
var _CartesianProvider = require("../context/CartesianProvider");
var _useScale = require("../hooks/useScale");
var _getSVGPoint = require("../internals/getSVGPoint");
var _hooks = require("../hooks");
var _context = require("../context");
var _useSeries = require("../hooks/useSeries");
var _jsxRuntime = require("react/jsx-runtime");
function ChartsVoronoiHandler(props) {
  const {
    voronoiMaxRadius,
    onItemClick
  } = props;
  const svgRef = (0, _hooks.useSvgRef)();
  const drawingArea = (0, _hooks.useDrawingArea)();
  const {
    xAxis,
    yAxis,
    xAxisIds,
    yAxisIds
  } = (0, _CartesianProvider.useCartesianContext)();
  const {
    dispatch
  } = React.useContext(_InteractionProvider.InteractionContext);
  const {
    series,
    seriesOrder
  } = (0, _useSeries.useScatterSeries)() ?? {};
  const voronoiRef = React.useRef({});
  const delauneyRef = React.useRef(undefined);
  const lastFind = React.useRef(undefined);
  const {
    setHighlighted,
    clearHighlighted
  } = (0, _context.useHighlighted)();
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];
  (0, _useEnhancedEffect.default)(() => {
    dispatch({
      type: 'updateVoronoiUsage',
      useVoronoiInteraction: true
    });
    return () => {
      dispatch({
        type: 'updateVoronoiUsage',
        useVoronoiInteraction: false
      });
    };
  }, [dispatch]);
  (0, _useEnhancedEffect.default)(() => {
    // This effect generate and store the Delaunay object that's used to map coordinate to closest point.

    if (seriesOrder === undefined || series === undefined) {
      // If there is no scatter chart series
      return;
    }
    voronoiRef.current = {};
    let points = [];
    seriesOrder.forEach(seriesId => {
      const {
        data,
        xAxisId,
        yAxisId,
        xAxisKey,
        yAxisKey
      } = series[seriesId];
      const xScale = xAxis[xAxisId ?? xAxisKey ?? defaultXAxisId].scale;
      const yScale = yAxis[yAxisId ?? yAxisKey ?? defaultYAxisId].scale;
      const getXPosition = (0, _useScale.getValueToPositionMapper)(xScale);
      const getYPosition = (0, _useScale.getValueToPositionMapper)(yScale);
      const seriesPoints = data.flatMap(({
        x,
        y
      }) => {
        const pointX = getXPosition(x);
        const pointY = getYPosition(y);
        if (!drawingArea.isPointInside({
          x: pointX,
          y: pointY
        })) {
          // If the point is not displayed we move them to a trash coordinate.
          // This avoids managing index mapping before/after filtering.
          // The trash point is far enough such that any point in the drawing area will be closer to the mouse than the trash coordinate.
          return [-drawingArea.width, -drawingArea.height];
        }
        return [pointX, pointY];
      });
      voronoiRef.current[seriesId] = {
        seriesId,
        startIndex: points.length,
        endIndex: points.length + seriesPoints.length
      };
      points = points.concat(seriesPoints);
    });
    delauneyRef.current = new _d3Delaunay.Delaunay(points);
    lastFind.current = undefined;
  }, [defaultXAxisId, defaultYAxisId, series, seriesOrder, xAxis, yAxis, drawingArea]);
  React.useEffect(() => {
    if (svgRef.current === null) {
      return undefined;
    }
    const element = svgRef.current;
    function getClosestPoint(event) {
      // Get mouse coordinate in global SVG space
      const svgPoint = (0, _getSVGPoint.getSVGPoint)(element, event);
      if (!drawingArea.isPointInside(svgPoint)) {
        lastFind.current = undefined;
        return 'outside-chart';
      }
      if (!delauneyRef.current) {
        return 'no-point-found';
      }
      const closestPointIndex = delauneyRef.current.find(svgPoint.x, svgPoint.y, lastFind.current);
      if (closestPointIndex === undefined) {
        return 'no-point-found';
      }
      lastFind.current = closestPointIndex;
      const closestSeries = Object.values(voronoiRef.current).find(value => {
        return 2 * closestPointIndex >= value.startIndex && 2 * closestPointIndex < value.endIndex;
      });
      if (closestSeries === undefined) {
        return 'no-point-found';
      }
      const dataIndex = (2 * closestPointIndex - voronoiRef.current[closestSeries.seriesId].startIndex) / 2;
      if (voronoiMaxRadius !== undefined) {
        const pointX = delauneyRef.current.points[2 * closestPointIndex];
        const pointY = delauneyRef.current.points[2 * closestPointIndex + 1];
        const dist2 = (pointX - svgPoint.x) ** 2 + (pointY - svgPoint.y) ** 2;
        if (dist2 > voronoiMaxRadius ** 2) {
          // The closest point is too far to be considered.
          return 'outside-voronoi-max-radius';
        }
      }
      return {
        seriesId: closestSeries.seriesId,
        dataIndex
      };
    }
    const handleMouseLeave = () => {
      dispatch({
        type: 'exitChart'
      });
      clearHighlighted();
    };
    const handleMouseMove = event => {
      const closestPoint = getClosestPoint(event);
      if (closestPoint === 'outside-chart') {
        dispatch({
          type: 'exitChart'
        });
        clearHighlighted();
        return;
      }
      if (closestPoint === 'outside-voronoi-max-radius' || closestPoint === 'no-point-found') {
        dispatch({
          type: 'leaveItem',
          data: {
            type: 'scatter'
          }
        });
        clearHighlighted();
        return;
      }
      const {
        seriesId,
        dataIndex
      } = closestPoint;
      dispatch({
        type: 'enterItem',
        data: {
          type: 'scatter',
          seriesId,
          dataIndex
        }
      });
      setHighlighted({
        seriesId,
        dataIndex
      });
    };
    const handleMouseClick = event => {
      if (!onItemClick) {
        return;
      }
      const closestPoint = getClosestPoint(event);
      if (typeof closestPoint === 'string') {
        // No point fond for any reason
        return;
      }
      const {
        seriesId,
        dataIndex
      } = closestPoint;
      onItemClick(event, {
        type: 'scatter',
        seriesId,
        dataIndex
      });
    };
    element.addEventListener('pointerleave', handleMouseLeave);
    element.addEventListener('pointermove', handleMouseMove);
    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('pointerleave', handleMouseLeave);
      element.removeEventListener('pointermove', handleMouseMove);
      element.removeEventListener('click', handleMouseClick);
    };
  }, [svgRef, dispatch, yAxis, xAxis, voronoiMaxRadius, onItemClick, setHighlighted, clearHighlighted, drawingArea]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {});
}
process.env.NODE_ENV !== "production" ? ChartsVoronoiHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event caught at the svg level
   * @param {ScatterItemIdentifier} scatterItemIdentifier Identify which item got clicked
   */
  onItemClick: _propTypes.default.func,
  /**
   * Defines the maximal distance between a scatter point and the pointer that triggers the interaction.
   * If `undefined`, the radius is assumed to be infinite.
   */
  voronoiMaxRadius: _propTypes.default.number
} : void 0;