import _extends from "@babel/runtime/helpers/esm/extends";
const formatter = ({
  series,
  seriesOrder
}, dataset) => {
  const completeSeries = Object.fromEntries(Object.entries(series).map(([seriesId, seriesData]) => {
    const datasetKeys = seriesData?.datasetKeys;
    const missingKeys = ['x', 'y', 'id'].filter(key => typeof datasetKeys?.[key] !== 'string');
    if (seriesData?.datasetKeys && missingKeys.length > 0) {
      throw new Error([`MUI X: scatter series with id='${seriesId}' has incomplete datasetKeys.`, `Properties ${missingKeys.map(key => `"${key}"`).join(', ')} are missing.`].join('\n'));
    }
    const data = !datasetKeys ? seriesData.data ?? [] : dataset?.map(d => {
      return {
        x: d[datasetKeys.x] ?? null,
        y: d[datasetKeys.y] ?? null,
        z: datasetKeys.z && d[datasetKeys.z],
        id: d[datasetKeys.id]
      };
    }) ?? [];
    return [seriesId, _extends({}, seriesData, {
      data,
      valueFormatter: seriesData.valueFormatter ?? (v => `(${v.x}, ${v.y})`)
    })];
  }));
  return {
    series: completeSeries,
    seriesOrder
  };
};
export default formatter;