const MAX_LENGTH = 160

export function getExcerpt(content: string, maxLength = MAX_LENGTH) {
  const [firstParagraph = ''] = content.trim().split('\n\n')
  if (firstParagraph.length <= maxLength) return firstParagraph
  return `${firstParagraph.slice(0, maxLength).trimEnd()}...`
}
