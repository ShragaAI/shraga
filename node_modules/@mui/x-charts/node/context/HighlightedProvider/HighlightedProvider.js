"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HighlightedProvider = HighlightedProvider;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useControlled = _interopRequireDefault(require("@mui/utils/useControlled"));
var _HighlightedContext = require("./HighlightedContext");
var _createIsFaded = require("./createIsFaded");
var _createIsHighlighted = require("./createIsHighlighted");
var _useSeries = require("../../hooks/useSeries");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["highlighted", "faded"];
const mergeDeprecatedOptions = options => {
  const _ref = options ?? {},
    {
      highlighted,
      faded
    } = _ref,
    other = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
  return (0, _extends2.default)({
    highlight: highlighted,
    fade: faded
  }, other);
};
function HighlightedProvider({
  children,
  highlightedItem: highlightedItemProps,
  onHighlightChange
}) {
  const [highlightedItem, setHighlightedItem] = (0, _useControlled.default)({
    controlled: highlightedItemProps,
    default: null,
    name: 'HighlightedProvider',
    state: 'highlightedItem'
  });
  const series = (0, _useSeries.useSeries)();
  const seriesById = React.useMemo(() => {
    const map = new Map();
    Object.keys(series).forEach(seriesType => {
      const seriesData = series[seriesType];
      Object.keys(seriesData?.series ?? {}).forEach(seriesId => {
        const seriesItem = seriesData?.series[seriesId];
        map.set(seriesId, mergeDeprecatedOptions(seriesItem?.highlightScope));
      });
    });
    return map;
  }, [series]);
  const highlightScope = highlightedItem && highlightedItem.seriesId ? seriesById.get(highlightedItem.seriesId) ?? undefined : undefined;
  const providerValue = React.useMemo(() => {
    return {
      isInitialized: true,
      data: {
        highlightScope,
        highlightedItem,
        setHighlighted: itemData => {
          setHighlightedItem(itemData);
          onHighlightChange?.(itemData);
        },
        clearHighlighted: () => {
          setHighlightedItem(null);
          onHighlightChange?.(null);
        },
        isHighlighted: (0, _createIsHighlighted.createIsHighlighted)(highlightScope, highlightedItem),
        isFaded: (0, _createIsFaded.createIsFaded)(highlightScope, highlightedItem)
      }
    };
  }, [highlightedItem, highlightScope, setHighlightedItem, onHighlightChange]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_HighlightedContext.HighlightedContext.Provider, {
    value: providerValue,
    children: children
  });
}
process.env.NODE_ENV !== "production" ? HighlightedProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: _propTypes.default.shape({
    dataIndex: _propTypes.default.number,
    seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
  }),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: _propTypes.default.func
} : void 0;