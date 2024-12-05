export default function millisToTime(
  time_with_penalty,
  penalty = 0,
  decimals = 3
) {
  if (time_with_penalty < 0 || penalty == 2) {
    return "DNF";
  }
  decimals = Math.min(3, decimals);
  const mins = Math.floor(time_with_penalty / 60000); // 1 minute = 60000ms
  const secs = Math.floor((time_with_penalty % 60000) / 1000); // 1 second = 1000ms
  const millis = Math.floor((time_with_penalty % 1000) / 10 ** (3 - decimals));
  let raw = "";
  if (mins == 0) {
    raw = `${String(secs).padStart(1, "0")}.${String(millis).padStart(
      decimals,
      "0"
    )}`;
  } else {
    raw = `${String(mins)}:${String(secs).padStart(1, "0")}.${String(
      millis
    ).padStart(decimals, "0")}`;
  }
  if (penalty == 1) {
    return raw + "+";
  }
  return raw;
}
