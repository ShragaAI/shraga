"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartesianContext = void 0;
var React = _interopRequireWildcard(require("react"));
const CartesianContext = exports.CartesianContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    xAxis: {},
    yAxis: {},
    xAxisIds: [],
    yAxisIds: []
  }
});
if (process.env.NODE_ENV !== 'production') {
  CartesianContext.displayName = 'CartesianContext';
}