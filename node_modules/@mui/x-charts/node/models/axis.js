"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isBandScaleConfig = isBandScaleConfig;
exports.isPointScaleConfig = isPointScaleConfig;
/**
 * Use this type instead of `AxisScaleConfig` when the values
 * shouldn't be provided by the user.
 */

function isBandScaleConfig(scaleConfig) {
  return scaleConfig.scaleType === 'band';
}
function isPointScaleConfig(scaleConfig) {
  return scaleConfig.scaleType === 'point';
}