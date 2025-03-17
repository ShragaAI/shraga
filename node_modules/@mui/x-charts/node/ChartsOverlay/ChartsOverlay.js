"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsOverlay = ChartsOverlay;
exports.useNoData = useNoData;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _ChartsLoadingOverlay = require("./ChartsLoadingOverlay");
var _useSeries = require("../hooks/useSeries");
var _ChartsNoDataOverlay = require("./ChartsNoDataOverlay");
var _jsxRuntime = require("react/jsx-runtime");
function useNoData() {
  const seriesPerType = (0, _useSeries.useSeries)();
  return Object.values(seriesPerType).every(seriesOfGivenType => {
    if (!seriesOfGivenType) {
      return true;
    }
    const {
      series,
      seriesOrder
    } = seriesOfGivenType;
    return seriesOrder.every(seriesId => series[seriesId].data.length === 0);
  });
}
function ChartsOverlay(props) {
  const noData = useNoData();
  if (props.loading) {
    const LoadingOverlay = props.slots?.loadingOverlay ?? _ChartsLoadingOverlay.ChartsLoadingOverlay;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(LoadingOverlay, (0, _extends2.default)({}, props.slotProps?.loadingOverlay));
  }
  if (noData) {
    const NoDataOverlay = props.slots?.noDataOverlay ?? _ChartsNoDataOverlay.ChartsNoDataOverlay;
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(NoDataOverlay, (0, _extends2.default)({}, props.slotProps?.noDataOverlay));
  }
  return null;
}