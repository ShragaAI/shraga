"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getLabel = require("../internals/getLabel");
const legendGetter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = (0, _getLabel.getLabel)(series[seriesId].label, 'legend');
    if (formattedLabel === undefined) {
      return acc;
    }
    acc.push({
      id: seriesId,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel
    });
    return acc;
  }, []);
};
var _default = exports.default = legendGetter;