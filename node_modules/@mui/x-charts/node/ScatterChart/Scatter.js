"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scatter = Scatter;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useScale = require("../hooks/useScale");
var _useInteractionItemProps = require("../hooks/useInteractionItemProps");
var _InteractionProvider = require("../context/InteractionProvider");
var _context = require("../context");
var _useDrawingArea = require("../hooks/useDrawingArea");
var _jsxRuntime = require("react/jsx-runtime");
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
  const drawingArea = (0, _useDrawingArea.useDrawingArea)();
  const {
    useVoronoiInteraction
  } = React.useContext(_InteractionProvider.InteractionContext);
  const skipInteractionHandlers = useVoronoiInteraction || series.disableHover;
  const getInteractionItemProps = (0, _useInteractionItemProps.useInteractionItemProps)(skipInteractionHandlers);
  const {
    isFaded,
    isHighlighted
  } = (0, _context.useHighlighted)();
  const cleanData = React.useMemo(() => {
    const getXPosition = (0, _useScale.getValueToPositionMapper)(xScale);
    const getYPosition = (0, _useScale.getValueToPositionMapper)(yScale);
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
    children: cleanData.map(dataPoint => /*#__PURE__*/(0, _jsxRuntime.jsx)("circle", (0, _extends2.default)({
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
  color: _propTypes.default.string.isRequired,
  colorGetter: _propTypes.default.func,
  markerSize: _propTypes.default.number.isRequired,
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   * @param {ScatterItemIdentifier} scatterItemIdentifier The scatter item identifier.
   */
  onItemClick: _propTypes.default.func,
  series: _propTypes.default.object.isRequired,
  xScale: _propTypes.default.func.isRequired,
  yScale: _propTypes.default.func.isRequired
} : void 0;