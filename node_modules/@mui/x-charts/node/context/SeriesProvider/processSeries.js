"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preprocessSeries = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _defaultizeColor = require("../../internals/defaultizeColor");
/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
const preprocessSeries = ({
  series,
  colors,
  seriesFormatters,
  dataset
}) => {
  // Group series by type
  const seriesGroups = {};
  series.forEach((seriesData, seriesIndex) => {
    const {
      id = `auto-generated-id-${seriesIndex}`,
      type
    } = seriesData;
    if (seriesGroups[type] === undefined) {
      seriesGroups[type] = {
        series: {},
        seriesOrder: []
      };
    }
    if (seriesGroups[type]?.series[id] !== undefined) {
      throw new Error(`MUI X: series' id "${id}" is not unique.`);
    }
    seriesGroups[type].series[id] = (0, _extends2.default)({
      id
    }, (0, _defaultizeColor.defaultizeColor)(seriesData, seriesIndex, colors));
    seriesGroups[type].seriesOrder.push(id);
  });
  const formattedSeries = {};
  // Apply formatter on a type group
  Object.keys(seriesFormatters).forEach(type => {
    const group = seriesGroups[type];
    if (group !== undefined) {
      formattedSeries[type] = seriesFormatters[type]?.(group, dataset) ?? seriesGroups[type];
    }
  });
  return formattedSeries;
};
exports.preprocessSeries = preprocessSeries;