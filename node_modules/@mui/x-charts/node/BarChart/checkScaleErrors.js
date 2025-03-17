"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkScaleErrors = checkScaleErrors;
var _constants = require("../constants");
var _axis = require("../models/axis");
const getAxisMessage = (axisDirection, axisId) => {
  const axisName = `${axisDirection}-axis`;
  const axisIdName = `${axisDirection}Axis`;
  const axisDefaultKey = axisDirection === 'x' ? _constants.DEFAULT_X_AXIS_KEY : _constants.DEFAULT_Y_AXIS_KEY;
  return axisId === axisDefaultKey ? `The first \`${axisIdName}\`` : `The ${axisName} with id "${axisId}"`;
};
function checkScaleErrors(verticalLayout, seriesId, xAxisId, xAxis, yAxisId, yAxis) {
  const xAxisConfig = xAxis[xAxisId];
  const yAxisConfig = yAxis[yAxisId];
  const discreteAxisConfig = verticalLayout ? xAxisConfig : yAxisConfig;
  const continuousAxisConfig = verticalLayout ? yAxisConfig : xAxisConfig;
  const discreteAxisId = verticalLayout ? xAxisId : yAxisId;
  const continuousAxisId = verticalLayout ? yAxisId : xAxisId;
  const discreteAxisDirection = verticalLayout ? 'x' : 'y';
  const continuousAxisDirection = verticalLayout ? 'y' : 'x';
  if (!(0, _axis.isBandScaleConfig)(discreteAxisConfig)) {
    throw new Error(`MUI X: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} should be of type "band" to display the bar series of id "${seriesId}".`);
  }
  if (discreteAxisConfig.data === undefined) {
    throw new Error(`MUI X: ${getAxisMessage(discreteAxisDirection, discreteAxisId)} should have data property.`);
  }
  if ((0, _axis.isBandScaleConfig)(continuousAxisConfig) || (0, _axis.isPointScaleConfig)(continuousAxisConfig)) {
    throw new Error(`MUI X: ${getAxisMessage(continuousAxisDirection, continuousAxisId)} should be a continuous type to display the bar series of id "${seriesId}".`);
  }
}