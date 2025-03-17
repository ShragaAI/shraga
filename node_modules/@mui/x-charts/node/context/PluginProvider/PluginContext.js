"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginContext = void 0;
var React = _interopRequireWildcard(require("react"));
const PluginContext = exports.PluginContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    colorProcessors: {},
    seriesFormatters: {},
    xExtremumGetters: {},
    yExtremumGetters: {},
    rotationExtremumGetters: {},
    radiusExtremumGetters: {}
  }
});
if (process.env.NODE_ENV !== 'production') {
  PluginContext.displayName = 'PluginContext';
}