export function toggleItem<T>(list: T[], item: T) {
  return list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item]
}
