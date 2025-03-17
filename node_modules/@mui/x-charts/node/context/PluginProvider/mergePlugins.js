"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultPlugins = void 0;
exports.mergePlugins = mergePlugins;
var _plugin = require("../../BarChart/plugin");
var _plugin2 = require("../../ScatterChart/plugin");
var _plugin3 = require("../../LineChart/plugin");
var _plugin4 = require("../../PieChart/plugin");
const defaultPlugins = exports.defaultPlugins = [_plugin.plugin, _plugin2.plugin, _plugin3.plugin, _plugin4.plugin];
function mergePlugins(plugins) {
  const defaultizedPlugins = plugins ?? defaultPlugins;
  const seriesFormatters = {};
  const colorProcessors = {};
  const xExtremumGetters = {};
  const yExtremumGetters = {};
  const rotationExtremumGetters = {};
  const radiusExtremumGetters = {};
  for (let i = 0; i < defaultizedPlugins.length; i += 1) {
    const plugin = defaultizedPlugins[i];
    const seriesType = plugin.seriesType;
    seriesFormatters[seriesType] = plugin.seriesFormatter;
    colorProcessors[seriesType] = plugin.colorProcessor;
    if (plugin.xExtremumGetter) {
      xExtremumGetters[seriesType] = plugin.xExtremumGetter;
    }
    if (plugin.yExtremumGetter) {
      yExtremumGetters[seriesType] = plugin.yExtremumGetter;
    }
    if (plugin.rotationExtremumGetter) {
      rotationExtremumGetters[seriesType] = plugin.rotationExtremumGetter;
    }
    if (plugin.radiusExtremumGetter) {
      radiusExtremumGetters[seriesType] = plugin.radiusExtremumGetter;
    }
  }
  return {
    seriesFormatters,
    colorProcessors,
    xExtremumGetters,
    yExtremumGetters,
    rotationExtremumGetters,
    radiusExtremumGetters
  };
}