"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSymbol = getSymbol;
// Returns the index of a defined shape
function getSymbol(shape) {
  const symbolNames = 'circle cross diamond square star triangle wye'.split(/ /);
  return symbolNames.indexOf(shape) || 0;
}