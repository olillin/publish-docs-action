export function parseBoolean(s) {
  const truthyValues = ['true', 't', 'yes', 'y', '1', 'enable', 'enabled']
  return truthyValues.includes(s.trim().toLowerCase())
}
