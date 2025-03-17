import * as React from 'react';
export const PluginContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    colorProcessors: {},
    seriesFormatters: {},
    xExtremumGetters: {},
    yExtremumGetters: {},
    rotationExtremumGetters: {},
    radiusExtremumGetters: {}
  }
});
if (process.env.NODE_ENV !== 'production') {
  PluginContext.displayName = 'PluginContext';
}