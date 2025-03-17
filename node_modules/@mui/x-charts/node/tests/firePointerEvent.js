"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firePointerEvent = firePointerEvent;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _internalTestUtils = require("@mui/internal-test-utils");
function firePointerEvent(target, type, options) {
  const originalGetBoundingClientRect = target.getBoundingClientRect;
  target.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    toJSON() {
      return {
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0
      };
    }
  });
  const event = new window.PointerEvent(type, (0, _extends2.default)({
    bubbles: true,
    cancelable: true,
    composed: true,
    isPrimary: true
  }, options));
  (0, _internalTestUtils.fireEvent)(target, event);
  target.getBoundingClientRect = originalGetBoundingClientRect;
}