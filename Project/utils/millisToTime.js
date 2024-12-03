export default function millisToTime(time, decimals = 3) {
  if (time < 0) {
    return "DNF";
  }
  decimals = Math.min(3, decimals);
  const mins = Math.floor(time / 60000); // 1 minute = 60000ms
  const secs = Math.floor((time % 60000) / 1000); // 1 second = 1000ms
  const millis = Math.floor((time % 1000) / 10 ** (3 - decimals));
  if (mins == 0) {
    return `${String(secs).padStart(1, "0")}.${String(millis).padStart(
      decimals,
      "0"
    )}`;
  } else {
    return `${String(mins)}:${String(secs).padStart(1, "0")}.${String(
      millis
    ).padStart(decimals, "0")}`;
  }
}
