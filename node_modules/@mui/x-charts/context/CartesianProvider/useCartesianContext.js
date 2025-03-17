'use client';

import * as React from 'react';
import { CartesianContext } from "./CartesianContext.js";
export const useCartesianContext = () => {
  const {
    data
  } = React.useContext(CartesianContext);
  return data;
};