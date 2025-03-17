"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInteractionItemProps = void 0;
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../context/InteractionProvider");
var _context = require("../context");
const useInteractionItemProps = skip => {
  const {
    dispatch: dispatchInteraction
  } = React.useContext(_InteractionProvider.InteractionContext);
  const {
    setHighlighted,
    clearHighlighted
  } = (0, _context.useHighlighted)();
  if (skip) {
    return () => ({});
  }
  const getInteractionItemProps = data => {
    const onPointerDown = event => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };
    const onPointerEnter = () => {
      dispatchInteraction({
        type: 'enterItem',
        data
      });
      setHighlighted({
        seriesId: data.seriesId,
        dataIndex: data.dataIndex
      });
    };
    const onPointerLeave = event => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      dispatchInteraction({
        type: 'leaveItem',
        data
      });
      clearHighlighted();
    };
    return {
      onPointerEnter,
      onPointerLeave,
      onPointerDown
    };
  };
  return getInteractionItemProps;
};
exports.useInteractionItemProps = useInteractionItemProps;