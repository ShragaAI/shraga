import * as React from 'react';
export const PolarContext = /*#__PURE__*/React.createContext({
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