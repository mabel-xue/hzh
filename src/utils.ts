export const getDatesBetween = (startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const dates = [];

  while (startDate <= endDate) {
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');
    dates.push(`${month}${day}`);
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
}

