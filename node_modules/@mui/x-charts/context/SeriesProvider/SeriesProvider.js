'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { blueberryTwilightPalette } from "../../colorPalettes/index.js";
import { SeriesContext } from "./SeriesContext.js";
import { preprocessSeries } from "./processSeries.js";
import { useSeriesFormatter } from "../PluginProvider/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
function SeriesProvider(props) {
  const {
    series,
    dataset,
    colors = blueberryTwilightPalette,
    children
  } = props;
  const seriesFormatters = useSeriesFormatter();
  const theme = useTheme();
  const formattedSeries = React.useMemo(() => ({
    isInitialized: true,
    data: preprocessSeries({
      series,
      colors: typeof colors === 'function' ? colors(theme.palette.mode) : colors,
      seriesFormatters,
      dataset: dataset
    })
  }), [series, colors, theme.palette.mode, seriesFormatters, dataset]);
  return /*#__PURE__*/_jsx(SeriesContext.Provider, {
    value: formattedSeries,
    children: children
  });
}
export { SeriesProvider };