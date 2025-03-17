"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSvgRef = useSvgRef;
var React = _interopRequireWildcard(require("react"));
var _DrawingProvider = require("../context/DrawingProvider");
function useSvgRef() {
  const {
    isInitialized,
    data
  } = React.useContext(_DrawingProvider.SvgContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the svg ref context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  return data;
}