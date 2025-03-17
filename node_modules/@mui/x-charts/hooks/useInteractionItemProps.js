'use client';

import * as React from 'react';
import { InteractionContext } from "../context/InteractionProvider.js";
import { useHighlighted } from "../context/index.js";
export const useInteractionItemProps = skip => {
  const {
    dispatch: dispatchInteraction
  } = React.useContext(InteractionContext);
  const {
    setHighlighted,
    clearHighlighted
  } = useHighlighted();
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