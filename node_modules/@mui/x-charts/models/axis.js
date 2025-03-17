/**
 * Use this type instead of `AxisScaleConfig` when the values
 * shouldn't be provided by the user.
 */

export function isBandScaleConfig(scaleConfig) {
  return scaleConfig.scaleType === 'band';
}
export function isPointScaleConfig(scaleConfig) {
  return scaleConfig.scaleType === 'point';
}