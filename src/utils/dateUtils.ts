export function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}
