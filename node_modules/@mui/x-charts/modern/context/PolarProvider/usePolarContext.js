'use client';

import * as React from 'react';
import { PolarContext } from "./PolarContext.js";
export const usePolarContext = () => {
  const {
    data
  } = React.useContext(PolarContext);
  return data;
};