"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginProvider = PluginProvider;
var React = _interopRequireWildcard(require("react"));
var _PluginContext = require("./PluginContext");
var _mergePlugins = require("./mergePlugins");
var _jsxRuntime = require("react/jsx-runtime");
function PluginProvider(props) {
  const {
    children,
    plugins
  } = props;
  const formattedSeries = React.useMemo(() => ({
    isInitialized: true,
    data: (0, _mergePlugins.mergePlugins)(plugins)
  }), [plugins]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_PluginContext.PluginContext.Provider, {
    value: formattedSeries,
    children: children
  });
}