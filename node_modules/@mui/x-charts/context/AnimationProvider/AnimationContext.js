import * as React from 'react';
export const AnimationContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    skipAnimation: undefined
  }
});
if (process.env.NODE_ENV !== 'production') {
  AnimationContext.displayName = 'AnimationContext';
}