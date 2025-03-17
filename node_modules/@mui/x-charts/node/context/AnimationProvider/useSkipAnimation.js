"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSkipAnimation = useSkipAnimation;
var React = _interopRequireWildcard(require("react"));
var _AnimationContext = require("./AnimationContext");
/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean|undefined} whether to skip animations
 */
function useSkipAnimation(skipAnimation) {
  const {
    isInitialized,
    data
  } = React.useContext(_AnimationContext.AnimationContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the animation ref context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  return skipAnimation || data.skipAnimation;
}