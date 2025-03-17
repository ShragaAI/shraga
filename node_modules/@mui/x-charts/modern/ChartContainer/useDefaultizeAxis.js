'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from "../constants/index.js";
const defaultizeAxis = (inAxis, dataset, axisName) => {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;
  return [...(inAxis?.map((axis, index) => _extends({
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
    return _extends({}, axisConfig, {
      data: dataset.map(d => d[dataKey])
    });
  });
};
export const useDefaultizeAxis = (inXAxis, inYAxis, dataset) => {
  const xAxis = React.useMemo(() => defaultizeAxis(inXAxis, dataset, 'x'), [inXAxis, dataset]);
  const yAxis = React.useMemo(() => defaultizeAxis(inYAxis, dataset, 'y'), [inYAxis, dataset]);
  return [xAxis, yAxis];
};