import { AxisDefaultized } from '../models/axis';
import { ZAxisDefaultized } from '../models/z-axis';
import { ColorLegendSelector } from './legend.types';
/**
 * Helper to select an axis definition according to its direction and id.
 */
export declare function useAxis({ axisDirection, axisId, }: ColorLegendSelector): ZAxisDefaultized | AxisDefaultized;
