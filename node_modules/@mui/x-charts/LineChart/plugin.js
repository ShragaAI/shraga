import { getExtremumX, getExtremumY } from "./extremums.js";
import formatter from "./formatter.js";
import getColor from "./getColor.js";
export const plugin = {
  seriesType: 'line',
  colorProcessor: getColor,
  seriesFormatter: formatter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY
};