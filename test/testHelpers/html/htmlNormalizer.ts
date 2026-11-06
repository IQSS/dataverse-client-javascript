import { JSDOM } from 'jsdom'

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

const document = new JSDOM('').window.document

const isElement = (node: Node | null | undefined): node is Element =>
  node !== null && node !== undefined && node.nodeType === node.ELEMENT_NODE

const isText = (node: Node): node is Text => node.nodeType === node.TEXT_NODE

const tagNameOf = (element: Element): string => element.tagName.toLowerCase()

const isBlockBoundary = (sibling: Node | undefined, parent: Node): boolean =>
  sibling === undefined
    ? !isElement(parent) || BLOCK_TAGS.has(tagNameOf(parent))
    : isElement(sibling) && BLOCK_TAGS.has(tagNameOf(sibling))

const sortAttributes = (element: Element): void => {
  const attributes = Array.from(element.attributes).sort((one, other) =>
    one.name.localeCompare(other.name)
  )
  attributes.forEach((attribute) => element.removeAttribute(attribute.name))
  attributes.forEach((attribute) => element.setAttribute(attribute.name, attribute.value))
}

const normalizeText = (text: Text, afterBoundary: boolean, beforeBoundary: boolean): void => {
  if (text.data.trim() === '') {
    if (afterBoundary || beforeBoundary) {
      text.remove()
    } else {
      text.data = ' '
    }
    return
  }

  let collapsed = text.data.replace(/\s+/g, ' ')
  if (afterBoundary) {
    collapsed = collapsed.replace(/^ /, '')
  }
  if (beforeBoundary) {
    collapsed = collapsed.replace(/ $/, '')
  }
  text.data = collapsed
}

const normalizeChildren = (parent: Node, whitespaceSensitive: boolean): void => {
  const childrenAsParsed = Array.from(parent.childNodes)

  childrenAsParsed.forEach((child, index) => {
    if (isElement(child)) {
      sortAttributes(child)
      normalizeChildren(
        child,
        whitespaceSensitive || WHITESPACE_SENSITIVE_TAGS.has(tagNameOf(child))
      )
      return
    }
    if (isText(child) && !whitespaceSensitive) {
      normalizeText(
        child,
        isBlockBoundary(childrenAsParsed[index - 1], parent),
        isBlockBoundary(childrenAsParsed[index + 1], parent)
      )
    }
  })
}

export const normalizeHtml = (html: string): string => {
  const template = document.createElement('template')
  template.innerHTML = html
  normalizeChildren(template.content, false)
  return template.innerHTML
}
