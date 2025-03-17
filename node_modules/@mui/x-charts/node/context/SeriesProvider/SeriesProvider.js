"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeriesProvider = SeriesProvider;
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _colorPalettes = require("../../colorPalettes");
var _SeriesContext = require("./SeriesContext");
var _processSeries = require("./processSeries");
var _PluginProvider = require("../PluginProvider");
var _jsxRuntime = require("react/jsx-runtime");
function SeriesProvider(props) {
  const {
    series,
    dataset,
    colors = _colorPalettes.blueberryTwilightPalette,
    children
  } = props;
  const seriesFormatters = (0, _PluginProvider.useSeriesFormatter)();
  const theme = (0, _styles.useTheme)();
  const formattedSeries = React.useMemo(() => ({
    isInitialized: true,
    data: (0, _processSeries.preprocessSeries)({
      series,
      colors: typeof colors === 'function' ? colors(theme.palette.mode) : colors,
      seriesFormatters,
      dataset: dataset
    })
  }), [series, colors, theme.palette.mode, seriesFormatters, dataset]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_SeriesContext.SeriesContext.Provider, {
    value: formattedSeries,
    children: children
  });
}