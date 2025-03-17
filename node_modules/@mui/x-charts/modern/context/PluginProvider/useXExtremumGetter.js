import * as React from 'react';
import { PluginContext } from "./PluginContext.js";
export function useXExtremumGetter(seriesType) {
  const {
    isInitialized,
    data
  } = React.useContext(PluginContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the plugin context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  if (!seriesType) {
    return data.xExtremumGetters;
  }
  return data.xExtremumGetters[seriesType];
}