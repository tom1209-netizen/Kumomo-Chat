export const getCurrentTime = ({ timezone = 'Asia/Ho_Chi_Minh' } = {}) => {
  const event = new Date(Date.now());
  const timestampRaw = event.toLocaleString('en-GB', { timezone });
  const [date, fullTime] = timestampRaw.split(',').map((value) => value.trim());

  const [hours, minutes] = fullTime.split(':');
  const time = `${hours}:${minutes}`;

  const timestamp = {
    date,
    time,
  };
  return timestamp;
};