import * as React from 'react';
export const SeriesContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {}
});
if (process.env.NODE_ENV !== 'production') {
  SeriesContext.displayName = 'SeriesContext';
}