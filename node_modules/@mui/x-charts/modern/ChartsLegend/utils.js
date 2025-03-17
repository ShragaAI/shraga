import getBarLegend from "../BarChart/legend.js";
import getScatterLegend from "../ScatterChart/legend.js";
import getLineLegend from "../LineChart/legend.js";
import getPieLegend from "../PieChart/legend.js";
const legendGetter = {
  bar: getBarLegend,
  scatter: getScatterLegend,
  line: getLineLegend,
  pie: getPieLegend
};
export function getSeriesToDisplay(series) {
  return Object.keys(series).flatMap(seriesType => {
    const getter = legendGetter[seriesType];
    return getter === undefined ? [] : getter(series[seriesType]);
  });
}