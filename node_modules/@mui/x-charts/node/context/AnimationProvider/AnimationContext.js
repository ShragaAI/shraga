"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationContext = void 0;
var React = _interopRequireWildcard(require("react"));
const AnimationContext = exports.AnimationContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    skipAnimation: undefined
  }
});
if (process.env.NODE_ENV !== 'production') {
  AnimationContext.displayName = 'AnimationContext';
}