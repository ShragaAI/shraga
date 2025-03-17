"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  seriesProviderUtils: true
};
exports.seriesProviderUtils = void 0;
var _processSeries = require("./processSeries");
var _SeriesProvider = require("./SeriesProvider");
Object.keys(_SeriesProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SeriesProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SeriesProvider[key];
    }
  });
});
var _SeriesContext = require("./SeriesContext");
Object.keys(_SeriesContext).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _SeriesContext[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SeriesContext[key];
    }
  });
});
var _Series = require("./Series.types");
Object.keys(_Series).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _Series[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Series[key];
    }
  });
});
const seriesProviderUtils = exports.seriesProviderUtils = {
  preprocessSeries: _processSeries.preprocessSeries
};