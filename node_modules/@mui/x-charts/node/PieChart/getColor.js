"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const getColor = series => {
  return dataIndex => {
    return series.data[dataIndex].color;
  };
};
var _default = exports.default = getColor;