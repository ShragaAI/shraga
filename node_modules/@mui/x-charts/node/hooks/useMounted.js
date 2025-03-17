"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMounted = useMounted;
var React = _interopRequireWildcard(require("react"));
var _useEnhancedEffect = _interopRequireDefault(require("@mui/utils/useEnhancedEffect"));
function useMounted(defer = false) {
  const [mountedState, setMountedState] = React.useState(false);
  (0, _useEnhancedEffect.default)(() => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);
  React.useEffect(() => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);
  return mountedState;
}