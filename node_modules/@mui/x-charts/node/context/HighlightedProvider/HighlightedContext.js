"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HighlightedContext = void 0;
var React = _interopRequireWildcard(require("react"));
/**
 * The data of the highlighted item.
 * To highlight an item, you need to provide the series id and the item id.
 * If targeting the whole series, you can omit the item id.
 * To clear the highlight, set the value to an empty object.
 *
 * @example
 * // Highlight the item with the series id 'london' and the item id 0.
 * { seriesId: 'london', dataIndex: 0 }
 *
 * // Highlight the whole series with the series id 'london'.
 * { seriesId: 'london' }
 *
 * // Clear the highlight.
 * {}
 */

const HighlightedContext = exports.HighlightedContext = /*#__PURE__*/React.createContext({
  isInitialized: false,
  data: {
    highlightedItem: null,
    setHighlighted: () => {},
    clearHighlighted: () => {},
    isHighlighted: () => false,
    isFaded: () => false
  }
});
if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightedContext';
}