export function getUserDataByTimeFilter(data, timeFilter) {
  return data.find((item) => item.timeFilter === timeFilter);
}
