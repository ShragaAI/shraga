"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PiePlot = PiePlot;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _DrawingProvider = require("../context/DrawingProvider");
var _PieArcPlot = require("./PieArcPlot");
var _PieArcLabelPlot = require("./PieArcLabelPlot");
var _getPercentageValue = require("../internals/getPercentageValue");
var _getPieCoordinates = require("./getPieCoordinates");
var _useSeries = require("../hooks/useSeries");
var _AnimationProvider = require("../context/AnimationProvider");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PiePlot API](https://mui.com/x/api/charts/pie-plot/)
 */
function PiePlot(props) {
  const {
    skipAnimation: inSkipAnimation,
    slots,
    slotProps,
    onItemClick
  } = props;
  const seriesData = (0, _useSeries.usePieSeries)();
  const {
    left,
    top,
    width,
    height
  } = React.useContext(_DrawingProvider.DrawingContext);
  const skipAnimation = (0, _AnimationProvider.useSkipAnimation)(inSkipAnimation);
  if (seriesData === undefined) {
    return null;
  }
  const {
    series,
    seriesOrder
  } = seriesData;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("g", {
    children: [seriesOrder.map(seriesId => {
      const {
        innerRadius: innerRadiusParam,
        outerRadius: outerRadiusParam,
        cornerRadius,
        paddingAngle,
        data,
        cx: cxParam,
        cy: cyParam,
        highlighted,
        faded
      } = series[seriesId];
      const {
        cx,
        cy,
        availableRadius
      } = (0, _getPieCoordinates.getPieCoordinates)({
        cx: cxParam,
        cy: cyParam
      }, {
        width,
        height
      });
      const outerRadius = (0, _getPercentageValue.getPercentageValue)(outerRadiusParam ?? availableRadius, availableRadius);
      const innerRadius = (0, _getPercentageValue.getPercentageValue)(innerRadiusParam ?? 0, availableRadius);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
        transform: `translate(${left + cx}, ${top + cy})`,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_PieArcPlot.PieArcPlot, {
          innerRadius: innerRadius,
          outerRadius: outerRadius,
          cornerRadius: cornerRadius,
          paddingAngle: paddingAngle,
          id: seriesId,
          data: data,
          skipAnimation: skipAnimation,
          highlighted: highlighted,
          faded: faded,
          onItemClick: onItemClick,
          slots: slots,
          slotProps: slotProps
        })
      }, seriesId);
    }), seriesOrder.map(seriesId => {
      const {
        innerRadius: innerRadiusParam,
        outerRadius: outerRadiusParam,
        arcLabelRadius: arcLabelRadiusParam,
        cornerRadius,
        paddingAngle,
        arcLabel,
        arcLabelMinAngle,
        data,
        cx: cxParam,
        cy: cyParam
      } = series[seriesId];
      const {
        cx,
        cy,
        availableRadius
      } = (0, _getPieCoordinates.getPieCoordinates)({
        cx: cxParam,
        cy: cyParam
      }, {
        width,
        height
      });
      const outerRadius = (0, _getPercentageValue.getPercentageValue)(outerRadiusParam ?? availableRadius, availableRadius);
      const innerRadius = (0, _getPercentageValue.getPercentageValue)(innerRadiusParam ?? 0, availableRadius);
      const arcLabelRadius = arcLabelRadiusParam === undefined ? (outerRadius + innerRadius) / 2 : (0, _getPercentageValue.getPercentageValue)(arcLabelRadiusParam, availableRadius);
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
        transform: `translate(${left + cx}, ${top + cy})`,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_PieArcLabelPlot.PieArcLabelPlot, {
          innerRadius: innerRadius,
          outerRadius: outerRadius ?? availableRadius,
          arcLabelRadius: arcLabelRadius,
          cornerRadius: cornerRadius,
          paddingAngle: paddingAngle,
          id: seriesId,
          data: data,
          skipAnimation: skipAnimation,
          arcLabel: arcLabel,
          arcLabelMinAngle: arcLabelMinAngle,
          slots: slots,
          slotProps: slotProps
        })
      }, seriesId);
    })]
  });
}
process.env.NODE_ENV !== "production" ? PiePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a pie item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
   * @param {DefaultizedPieValueType} item The pie item.
   */
  onItemClick: _propTypes.default.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: _propTypes.default.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object
} : void 0;