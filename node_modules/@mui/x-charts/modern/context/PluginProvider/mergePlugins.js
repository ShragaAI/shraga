import { plugin as barPlugin } from "../../BarChart/plugin.js";
import { plugin as scatterPlugin } from "../../ScatterChart/plugin.js";
import { plugin as linePlugin } from "../../LineChart/plugin.js";
import { plugin as piePlugin } from "../../PieChart/plugin.js";
export const defaultPlugins = [barPlugin, scatterPlugin, linePlugin, piePlugin];
export function mergePlugins(plugins) {
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