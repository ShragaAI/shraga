'use client';

import * as React from 'react';
import { PluginContext } from "./PluginContext.js";
import { mergePlugins } from "./mergePlugins.js";
import { jsx as _jsx } from "react/jsx-runtime";
function PluginProvider(props) {
  const {
    children,
    plugins
  } = props;
  const formattedSeries = React.useMemo(() => ({
    isInitialized: true,
    data: mergePlugins(plugins)
  }), [plugins]);
  return /*#__PURE__*/_jsx(PluginContext.Provider, {
    value: formattedSeries,
    children: children
  });
}
export { PluginProvider };