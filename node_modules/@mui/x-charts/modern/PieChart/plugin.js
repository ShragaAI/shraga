import formatter from "./formatter.js";
import getColor from "./getColor.js";
export const plugin = {
  seriesType: 'pie',
  colorProcessor: getColor,
  seriesFormatter: formatter
};