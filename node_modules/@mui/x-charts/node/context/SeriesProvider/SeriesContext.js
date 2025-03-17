"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeriesContext = void 0;
var React = _interopRequireWildcard(require("react"));
const SeriesContext = exports.SeriesContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {}
});
if (process.env.NODE_ENV !== 'production') {
  SeriesContext.displayName = 'SeriesContext';
}