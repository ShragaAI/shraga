import { getExtremumX, getExtremumY } from "./extremums.js";
import formatter from "./formatter.js";
import getColor from "./getColor.js";
export const plugin = {
  seriesType: 'scatter',
  seriesFormatter: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY
};