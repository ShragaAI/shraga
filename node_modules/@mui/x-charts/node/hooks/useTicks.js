"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTickNumber = getTickNumber;
exports.useTicks = useTicks;
var React = _interopRequireWildcard(require("react"));
var _isBandScale = require("../internals/isBandScale");
var _isInfinity = require("../internals/isInfinity");
function getTickNumber(params) {
  const {
    tickMaxStep,
    tickMinStep,
    tickNumber,
    range,
    domain
  } = params;
  const maxTicks = tickMinStep === undefined ? 999 : Math.floor(Math.abs(domain[1] - domain[0]) / tickMinStep);
  const minTicks = tickMaxStep === undefined ? 2 : Math.ceil(Math.abs(domain[1] - domain[0]) / tickMaxStep);
  const defaultizedTickNumber = tickNumber ?? Math.floor(Math.abs(range[1] - range[0]) / 50);
  return Math.min(maxTicks, Math.max(minTicks, defaultizedTickNumber));
}
const offsetRatio = {
  start: 0,
  extremities: 0,
  end: 1,
  middle: 0.5
};
function useTicks(options) {
  const {
    scale,
    tickNumber,
    valueFormatter,
    tickInterval,
    tickPlacement = 'extremities',
    tickLabelPlacement = 'middle'
  } = options;
  return React.useMemo(() => {
    // band scale
    if ((0, _isBandScale.isBandScale)(scale)) {
      const domain = scale.domain();
      if (scale.bandwidth() > 0) {
        // scale type = 'band'
        const filteredDomain = typeof tickInterval === 'function' && domain.filter(tickInterval) || typeof tickInterval === 'object' && tickInterval || domain;
        return [...filteredDomain.map(value => ({
          value,
          formattedValue: valueFormatter?.(value, {
            location: 'tick'
          }) ?? `${value}`,
          offset: scale(value) - (scale.step() - scale.bandwidth()) / 2 + offsetRatio[tickPlacement] * scale.step(),
          labelOffset: tickLabelPlacement === 'tick' ? 0 : scale.step() * (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement])
        })), ...(tickPlacement === 'extremities' ? [{
          formattedValue: undefined,
          offset: scale.range()[1],
          labelOffset: 0
        }] : [])];
      }

      // scale type = 'point'
      const filteredDomain = typeof tickInterval === 'function' && domain.filter(tickInterval) || typeof tickInterval === 'object' && tickInterval || domain;
      return filteredDomain.map(value => ({
        value,
        formattedValue: valueFormatter?.(value, {
          location: 'tick'
        }) ?? `${value}`,
        offset: scale(value),
        labelOffset: 0
      }));
    }
    const domain = scale.domain();
    // Skip axis rendering if no data is available
    // - The domains contains Infinity for continuous scales.
    if (domain.some(_isInfinity.isInfinity)) {
      return [];
    }
    const ticks = typeof tickInterval === 'object' ? tickInterval : scale.ticks(tickNumber);
    return ticks.map(value => ({
      value,
      formattedValue: valueFormatter?.(value, {
        location: 'tick'
      }) ?? scale.tickFormat(tickNumber)(value),
      offset: scale(value),
      labelOffset: 0
    }));
  }, [scale, tickInterval, tickNumber, valueFormatter, tickPlacement, tickLabelPlacement]);
}