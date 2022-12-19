export function startTimeFormat(datetime) {
  let [date, time] = datetime.split('T');
  time = time.split('.');
  time.pop();
  time.join();
  let result = date + ' ' + time;
  return result;
}