export function pushRecent<T>(
  list: T[],
  item: T,
  max: number,
  isSame: (a: T, b: T) => boolean = (a, b) => a === b,
) {
  return [item, ...list.filter((entry) => !isSame(entry, item))].slice(0, max)
}
