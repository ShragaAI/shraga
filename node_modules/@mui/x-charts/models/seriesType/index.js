// Series definition

// item identifier

export * from "./line.js";
export * from "./bar.js";
export * from "./scatter.js";
export * from "./pie.js";
// Helpers

export function isDefaultizedBarSeries(series) {
  return series.type === 'bar';
}
export function isBarSeries(series) {
  return series.type === 'bar';
}