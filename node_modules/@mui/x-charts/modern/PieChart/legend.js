import { getLabel } from "../internals/getLabel.js";
const legendGetter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach(item => {
      const formattedLabel = getLabel(item.label, 'legend');
      if (formattedLabel === undefined) {
        return;
      }
      acc.push({
        id: item.id,
        seriesId,
        color: item.color,
        label: formattedLabel,
        itemId: item.id
      });
    });
    return acc;
  }, []);
};
export default legendGetter;