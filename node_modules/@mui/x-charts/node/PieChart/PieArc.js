"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieArc = PieArc;
exports.getPieArcUtilityClass = getPieArcUtilityClass;
exports.pieArcClasses = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _web = require("@react-spring/web");
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _styles = require("@mui/material/styles");
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _useInteractionItemProps = require("../hooks/useInteractionItemProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["classes", "color", "cornerRadius", "dataIndex", "endAngle", "id", "innerRadius", "isFaded", "isHighlighted", "onClick", "outerRadius", "paddingAngle", "startAngle", "highlightScope"];
function getPieArcUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiPieArc', slot);
}
const pieArcClasses = exports.pieArcClasses = (0, _generateUtilityClasses.default)('MuiPieArc', ['root', 'highlighted', 'faded']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted,
    dataIndex
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, `data-index-${dataIndex}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return (0, _composeClasses.default)(slots, getPieArcUtilityClass, classes);
};
const PieArcRoot = (0, _styles.styled)(_web.animated.path, {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc
})(({
  theme
}) => ({
  // Got to move stroke to an element prop instead of style.
  stroke: (theme.vars || theme).palette.background.paper,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in, filter 0.2s ease-in'
}));
function PieArc(props) {
  const {
      classes: innerClasses,
      color,
      cornerRadius,
      dataIndex,
      endAngle,
      id,
      innerRadius,
      isFaded,
      isHighlighted,
      onClick,
      outerRadius,
      paddingAngle,
      startAngle
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted
  };
  const classes = useUtilityClasses(ownerState);
  const getInteractionItemProps = (0, _useInteractionItemProps.useInteractionItemProps)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(PieArcRoot, (0, _extends2.default)({
    d: (0, _web.to)([startAngle, endAngle, paddingAngle, innerRadius, outerRadius, cornerRadius], (sA, eA, pA, iR, oR, cR) => (0, _d3Shape.arc)().cornerRadius(cR)({
      padAngle: pA,
      startAngle: sA,
      endAngle: eA,
      innerRadius: iR,
      outerRadius: oR
    })),
    visibility: (0, _web.to)([startAngle, endAngle], (sA, eA) => sA === eA ? 'hidden' : 'visible')
    // @ts-expect-error
    ,
    onClick: onClick,
    cursor: onClick ? 'pointer' : 'unset',
    ownerState: ownerState,
    className: classes.root,
    fill: ownerState.color,
    opacity: ownerState.isFaded ? 0.3 : 1,
    filter: ownerState.isHighlighted ? 'brightness(120%)' : 'none',
    strokeWidth: 1,
    strokeLinejoin: "round"
  }, other, getInteractionItemProps({
    type: 'pie',
    seriesId: id,
    dataIndex
  })));
}
process.env.NODE_ENV !== "production" ? PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  dataIndex: _propTypes.default.number.isRequired,
  /**
   * @deprecated Use the `isFaded` or `isHighlighted` props instead.
   */
  highlightScope: _propTypes.default.shape({
    fade: _propTypes.default.oneOf(['global', 'none', 'series']),
    faded: _propTypes.default.oneOf(['global', 'none', 'series']),
    highlight: _propTypes.default.oneOf(['item', 'none', 'series']),
    highlighted: _propTypes.default.oneOf(['item', 'none', 'series'])
  }),
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  isFaded: _propTypes.default.bool.isRequired,
  isHighlighted: _propTypes.default.bool.isRequired
} : void 0;