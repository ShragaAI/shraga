"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePolarContext = void 0;
var React = _interopRequireWildcard(require("react"));
var _PolarContext = require("./PolarContext");
const usePolarContext = () => {
  const {
    data
  } = React.useContext(_PolarContext.PolarContext);
  return data;
};
exports.usePolarContext = usePolarContext;