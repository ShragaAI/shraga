"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHighlighted = useHighlighted;
var React = _interopRequireWildcard(require("react"));
var _HighlightedContext = require("./HighlightedContext");
/**
 * A hook to get the highlighted state of the chart.
 *
 * Please consider using the `useItemHighlighted` hook if you need to check the state of a specific item.
 *
 * @returns {HighlightedState} the state of the chart
 */
function useHighlighted() {
  const {
    isInitialized,
    data
  } = React.useContext(_HighlightedContext.HighlightedContext);
  if (!isInitialized) {
    throw new Error(['MUI X: Could not find the highlighted ref context.', 'It looks like you rendered your component outside of a ChartsContainer parent component.'].join('\n'));
  }
  return data;
}