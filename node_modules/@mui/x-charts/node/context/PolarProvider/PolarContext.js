"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PolarContext = void 0;
var React = _interopRequireWildcard(require("react"));
const PolarContext = exports.PolarContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    rotationAxis: {},
    radiusAxis: {},
    rotationAxisIds: [],
    radiusAxisIds: []
  }
});
if (process.env.NODE_ENV !== 'production') {
  PolarContext.displayName = 'PolarContext';
}