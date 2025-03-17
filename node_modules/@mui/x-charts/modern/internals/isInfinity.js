export function isInfinity(v) {
  return typeof v === 'number' && !Number.isFinite(v);
}