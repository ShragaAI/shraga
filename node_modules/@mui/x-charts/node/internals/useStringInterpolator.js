"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStringInterpolator = void 0;
var React = _interopRequireWildcard(require("react"));
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
function usePrevious(value) {
  const ref = React.useRef({
    currentPath: value,
    previousPath: undefined
  });
  if (ref.current.currentPath !== value) {
    ref.current = {
      currentPath: value,
      previousPath: ref.current.currentPath
    };
  }
  return ref.current;
}
const useStringInterpolator = path => {
  const memoryRef = usePrevious(path);
  const interpolator = React.useMemo(() => memoryRef.previousPath ? (0, _d3Interpolate.interpolateString)(memoryRef.previousPath, memoryRef.currentPath) : () => memoryRef.currentPath, [memoryRef.currentPath, memoryRef.previousPath]);
  return interpolator;
};
exports.useStringInterpolator = useStringInterpolator;