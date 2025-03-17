"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCartesianContext = void 0;
var React = _interopRequireWildcard(require("react"));
var _CartesianContext = require("./CartesianContext");
const useCartesianContext = () => {
  const {
    data
  } = React.useContext(_CartesianContext.CartesianContext);
  return data;
};
exports.useCartesianContext = useCartesianContext;