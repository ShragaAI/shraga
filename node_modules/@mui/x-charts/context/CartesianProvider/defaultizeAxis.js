import _extends from "@babel/runtime/helpers/esm/extends";
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from "../../constants/index.js";
export const defaultizeAxis = (inAxis, axisName) => {
  const DEFAULT_AXIS_KEY = axisName === 'x' ? DEFAULT_X_AXIS_KEY : DEFAULT_Y_AXIS_KEY;
  return [...(inAxis?.map((axis, index) => _extends({
    id: `defaultized-${axisName}-axis-${index}`
  }, axis)) ?? []), ...(inAxis === undefined || inAxis.findIndex(({
    id
  }) => id === DEFAULT_AXIS_KEY) === -1 ? [{
    id: DEFAULT_AXIS_KEY,
    scaleType: 'linear'
  }] : [])];
};