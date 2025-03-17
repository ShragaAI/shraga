"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxis = useAxis;
var React = _interopRequireWildcard(require("react"));
var _ZAxisContextProvider = require("../context/ZAxisContextProvider");
var _useCartesianContext = require("../context/CartesianProvider/useCartesianContext");
/**
 * Helper to select an axis definition according to its direction and id.
 */
function useAxis({
  axisDirection,
  axisId
}) {
  const {
    xAxis,
    xAxisIds,
    yAxis,
    yAxisIds
  } = (0, _useCartesianContext.useCartesianContext)();
  const {
    zAxis,
    zAxisIds
  } = React.useContext(_ZAxisContextProvider.ZAxisContext);
  switch (axisDirection) {
    case 'x':
      {
        const id = typeof axisId === 'string' ? axisId : xAxisIds[axisId ?? 0];
        return xAxis[id];
      }
    case 'y':
      {
        const id = typeof axisId === 'string' ? axisId : yAxisIds[axisId ?? 0];
        return yAxis[id];
      }
    case 'z':
    default:
      {
        const id = typeof axisId === 'string' ? axisId : zAxisIds[axisId ?? 0];
        return zAxis[id];
      }
  }
}