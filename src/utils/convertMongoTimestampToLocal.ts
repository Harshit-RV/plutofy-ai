export const convertMongoTimestampToLocal = (mongoTimestamp: Date): string => {
  const date = new Date(mongoTimestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Determine AM/PM
  const period = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedDate = `${String(hours).padStart(2, '0')}:${minutes} ${period}, ${day}/${month}/${year} `;

  return formattedDate;
};