"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartId = useChartId;
var React = _interopRequireWildcard(require("react"));
var _DrawingProvider = require("../context/DrawingProvider");
function useChartId() {
  const {
    chartId
  } = React.useContext(_DrawingProvider.DrawingContext);
  return React.useMemo(() => chartId, [chartId]);
}