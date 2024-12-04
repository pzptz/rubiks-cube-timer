/**
 * Given an ISO string timestamp, returns a string representing how long ago it was.
 *
 * @param {string} timestamp Timestamp in ISO string format.
 * @returns String representing how long ago the timestamp was, in the format
 * X {yrs/mos/days/hrs/mins} ago.
 */

export default function date(timestamp) {
  const now = new Date();

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const gmtOffsetInMinutes = now.getTimezoneOffset(); // Returns the offset in minutes (negative for UTC+)
  let gmtOffsetInHours = -gmtOffsetInMinutes / 60;
  timestamp = timestamp.split(" ")[0] + "+00:00";
  const date = new Date(timestamp);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Automatically use the device timezone
    dateStyle: "medium",
    timeStyle: "short",
  });
  return formatter.format(date);
}
