const WHITESPACE_SENSITIVE_TAGS = new Set(['pre', 'textarea'])

const BLOCK_TAGS = new Set([
  'address',
  'article',
  'aside',
  'blockquote',
  'body',
  'br',
  'div',
  'dd',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'li',
  'main',
  'nav',
  'ol',
  'p',
  'pre',
  'section',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul'
])

const TAG_PATTERN = /^<\s*(\/?)\s*([a-zA-Z][\w:-]*)([\s\S]*?)(\/?)\s*>$/
const ATTRIBUTE_PATTERN = /([\w:-]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g

interface ParsedTag {
  closing: boolean
  name: string
  selfClosing: boolean
}

const parseTag = (token: string): ParsedTag | undefined => {
  const match = TAG_PATTERN.exec(token)
  if (match === null) {
    return undefined
  }
  return {
    closing: match[1] === '/',
    name: match[2].toLowerCase(),
    selfClosing: match[4] === '/'
  }
}

const normalizeTag = (token: string): string => {
  const match = TAG_PATTERN.exec(token)
  if (match === null) {
    return token
  }
  const [, closing, name, attributeSource, selfClosing] = match
  const attributes = Array.from(attributeSource.matchAll(ATTRIBUTE_PATTERN))
    .map(([, attributeName, attributeValue]) =>
      attributeValue === undefined
        ? attributeName.toLowerCase()
        : `${attributeName.toLowerCase()}=${normalizeAttributeValue(attributeValue)}`
    )
    .sort()
  const renderedAttributes = attributes.length === 0 ? '' : ` ${attributes.join(' ')}`
  return `<${closing}${name.toLowerCase()}${renderedAttributes}${selfClosing}>`
}

const normalizeAttributeValue = (value: string): string => {
  const unquoted =
    (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
      ? value.slice(1, -1)
      : value
  return `"${unquoted}"`
}

const isBlockBoundary = (token: string | undefined): boolean => {
  if (token === undefined) {
    return true
  }
  const tag = parseTag(token)
  return tag !== undefined && BLOCK_TAGS.has(tag.name)
}

export const normalizeHtml = (html: string): string => {
  const tokens = html.split(/(<[^>]*>)/).filter((token) => token !== '')
  const normalized: string[] = []
  let whitespaceSensitiveDepth = 0

  tokens.forEach((token, index) => {
    const tag = token.startsWith('<') ? parseTag(token) : undefined

    if (tag !== undefined) {
      if (tag.closing && WHITESPACE_SENSITIVE_TAGS.has(tag.name)) {
        whitespaceSensitiveDepth = Math.max(0, whitespaceSensitiveDepth - 1)
      }
      normalized.push(normalizeTag(token))
      if (!tag.closing && !tag.selfClosing && WHITESPACE_SENSITIVE_TAGS.has(tag.name)) {
        whitespaceSensitiveDepth += 1
      }
      return
    }

    if (token.startsWith('<') || whitespaceSensitiveDepth > 0) {
      normalized.push(token)
      return
    }

    const previousToken = tokens[index - 1]
    const nextToken = tokens[index + 1]

    if (token.trim() === '') {
      if (!isBlockBoundary(previousToken) && !isBlockBoundary(nextToken)) {
        normalized.push(' ')
      }
      return
    }

    let text = token.replace(/\s+/g, ' ')
    if (isBlockBoundary(previousToken)) {
      text = text.replace(/^ /, '')
    }
    if (isBlockBoundary(nextToken)) {
      text = text.replace(/ $/, '')
    }
    normalized.push(text)
  })

  return normalized.join('')
}
