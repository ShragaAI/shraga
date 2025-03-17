const getColor = series => {
  return dataIndex => {
    return series.data[dataIndex].color;
  };
};
export default getColor;