"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSeriesFormatter = useSeriesFormatter;
var React = _interopRequireWildcard(require("react"));
var _PluginContext = require("./PluginContext");
function useSeriesFormatter(seriesType) {
  const {
    isInitialized,
    data
  } = React.useContext(_PluginContext.PluginContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the plugin context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  if (!seriesType) {
    return data.seriesFormatters;
  }
  return data.seriesFormatters[seriesType];
}