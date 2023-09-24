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

export function encrypt(key?) {  
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const day = String(new Date().getDate()).padStart(2, '0');
  const encryptKey = key || `${month}${day}`
  const encryptKeyReverse = encryptKey.split('').reverse().join('')
  return (Math.ceil((+encryptKey*+encryptKeyReverse)/3)+'').slice(-4);  
}
  