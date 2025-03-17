"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsOnAxisClickHandler = ChartsOnAxisClickHandler;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _InteractionProvider = require("../context/InteractionProvider");
var _useSeries = require("../hooks/useSeries");
var _hooks = require("../hooks");
var _CartesianProvider = require("../context/CartesianProvider");
var _jsxRuntime = require("react/jsx-runtime");
function ChartsOnAxisClickHandler(props) {
  const {
    onAxisClick
  } = props;
  const svgRef = (0, _hooks.useSvgRef)();
  const series = (0, _useSeries.useSeries)();
  const {
    axis
  } = React.useContext(_InteractionProvider.InteractionContext);
  const {
    xAxisIds,
    xAxis,
    yAxisIds,
    yAxis
  } = (0, _CartesianProvider.useCartesianContext)();
  React.useEffect(() => {
    const element = svgRef.current;
    if (element === null || !onAxisClick) {
      return () => {};
    }
    const handleMouseClick = event => {
      event.preventDefault();
      const isXaxis = axis.x && axis.x.index !== -1;
      const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
      const dataIndex = isXaxis ? axis.x && axis.x.index : axis.y && axis.y.index;
      if (dataIndex == null) {
        return;
      }
      const seriesValues = {};
      Object.keys(series).filter(seriesType => ['bar', 'line'].includes(seriesType)).forEach(seriesType => {
        series[seriesType]?.seriesOrder.forEach(seriesId => {
          const seriesItem = series[seriesType].series[seriesId];
          const providedXAxisId = seriesItem.xAxisId ?? seriesItem.xAxisKey;
          const providedYAxisId = seriesItem.yAxisId ?? seriesItem.yAxisKey;
          const axisKey = isXaxis ? providedXAxisId : providedYAxisId;
          if (axisKey === undefined || axisKey === USED_AXIS_ID) {
            seriesValues[seriesId] = seriesItem.data[dataIndex];
          }
        });
      });
      const axisValue = (isXaxis ? xAxis : yAxis)[USED_AXIS_ID].data?.[dataIndex];
      onAxisClick(event, {
        dataIndex,
        axisValue,
        seriesValues
      });
    };
    element.addEventListener('click', handleMouseClick);
    return () => {
      element.removeEventListener('click', handleMouseClick);
    };
  }, [axis.x, axis.y, onAxisClick, series, svgRef, xAxis, xAxisIds, yAxis, yAxisIds]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {});
}
process.env.NODE_ENV !== "production" ? ChartsOnAxisClickHandler.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The function called for onClick events.
   * The second argument contains information about all line/bar elements at the current mouse position.
   * @param {MouseEvent} event The mouse event recorded on the `<svg/>` element.
   * @param {null | AxisData} data The data about the clicked axis and items associated with it.
   */
  onAxisClick: _propTypes.default.func
} : void 0;