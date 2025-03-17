"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDefaultizeAxis = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _constants = require("../constants");
const defaultizeAxis = (inAxis, dataset, axisName) => {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? _constants.DEFAULT_X_AXIS_KEY : _constants.DEFAULT_Y_AXIS_KEY;
  return [...(inAxis?.map((axis, index) => (0, _extends2.default)({
    id: `defaultized-${axisName}-axis-${index}`
  }, axis)) ?? []), ...(inAxis === undefined || inAxis.findIndex(({
    id
  }) => id === DEFAULT_AXIS_KEY) === -1 ? [{
    id: DEFAULT_AXIS_KEY,
    scaleType: 'linear'
  }] : [])].map(axisConfig => {
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return axisConfig;
    }
    if (dataset === undefined) {
      throw new Error(`MUI X: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }
    return (0, _extends2.default)({}, axisConfig, {
      data: dataset.map(d => d[dataKey])
    });
  });
};
const useDefaultizeAxis = (inXAxis, inYAxis, dataset) => {
  const xAxis = React.useMemo(() => defaultizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);
  const yAxis = React.useMemo(() => defaultizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);
  return [xAxis, yAxis];
};
exports.useDefaultizeAxis = useDefaultizeAxis;