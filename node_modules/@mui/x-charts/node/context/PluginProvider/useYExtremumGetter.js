"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useYExtremumGetter = useYExtremumGetter;
var React = _interopRequireWildcard(require("react"));
var _PluginContext = require("./PluginContext");
function useYExtremumGetter(seriesType) {
  const {
    isInitialized,
    data
  } = React.useContext(_PluginContext.PluginContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the plugin context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  if (!seriesType) {
    return data.yExtremumGetters;
  }
  return data.yExtremumGetters[seriesType];
}