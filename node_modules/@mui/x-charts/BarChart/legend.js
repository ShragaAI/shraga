import { getLabel } from "../internals/getLabel.js";
const legendGetter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const formattedLabel = getLabel(series[seriesId].label, 'legend');
    if (formattedLabel === undefined) {
      return acc;
    }
    acc.push({
      id: seriesId,
      seriesId,
      color: series[seriesId].color,
      label: formattedLabel
    });
    return acc;
  }, []);
};
export default legendGetter;