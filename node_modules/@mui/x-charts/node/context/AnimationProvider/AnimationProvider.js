"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationProvider = AnimationProvider;
var _web = require("@react-spring/web");
var React = _interopRequireWildcard(require("react"));
var _AnimationContext = require("./AnimationContext");
var _jsxRuntime = require("react/jsx-runtime");
function AnimationProvider(props) {
  // Part of the behavior was taken from:
  // https://github.com/pmndrs/react-spring/blob/fd65b605b85c3a24143c4ce9dd322fdfca9c66be/packages/shared/src/hooks/useReducedMotion.ts
  const {
    children,
    skipAnimation: inSkipAnimation
  } = props;

  // Skip animation test/jsdom
  const isAnimationDisabledEnvironment = typeof window === 'undefined' || !window?.matchMedia;

  // We use the value of `isAnimationDisabledEnvironment` as the initial value of `skipAnimation` to avoid
  // re-rendering the component on environments where matchMedia is not supported, hence skipAnimation will always be true.
  const [skipAnimation, setSkipAnimation] = React.useState(isAnimationDisabledEnvironment || undefined);
  (0, _web.useIsomorphicLayoutEffect)(() => {
    if (isAnimationDisabledEnvironment) {
      return undefined;
    }
    const handleMediaChange = event => {
      // This hook can remove animation but never activate it.
      const inputValue = event.matches || undefined;
      setSkipAnimation(inputValue);
      _web.Globals.assign({
        skipAnimation: inputValue
      });
    };
    const mql = window.matchMedia('(prefers-reduced-motion)');
    handleMediaChange(mql);

    // MatchMedia is not fully supported in all environments, so we need to check if it exists before calling addEventListener
    mql?.addEventListener?.('change', handleMediaChange);
    return () => {
      mql?.removeEventListener?.('change', handleMediaChange);
    };
  }, []);
  const value = React.useMemo(() => ({
    isInitialized: true,
    data: {
      // If dev sets `skipAnimation` to true, it will skip all animations.
      // If dev sets `skipAnimation` to false, it will use user's preference.
      skipAnimation: inSkipAnimation || skipAnimation
    }
  }), [skipAnimation, inSkipAnimation]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_AnimationContext.AnimationContext.Provider, {
    value: value,
    children: children
  });
}