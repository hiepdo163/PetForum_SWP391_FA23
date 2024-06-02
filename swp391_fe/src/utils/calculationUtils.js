export function calculateDifference(currentValue, lastMonthValue) {
  return currentValue - lastMonthValue;
}

export function calculatePercentageChange(currentValue, lastMonthValue) {
  return !lastMonthValue ? 0 : (currentValue / lastMonthValue) * 100;
}
