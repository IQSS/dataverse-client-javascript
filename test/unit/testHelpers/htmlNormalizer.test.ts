import { normalizeHtml } from '../../testHelpers/html/htmlNormalizer'
import {
  CONTENT_FIELD_WITH_ALL_TAGS,
  EXPECTED_CONTENT_FIELD_WITH_ALL_TAGS
} from '../../testHelpers/collections/collectionHelper'

describe('normalizeHtml', () => {
  describe('differences the server may introduce', () => {
    test('should ignore the order of attributes', () => {
      expect(
        normalizeHtml('<a target="_blank" rel="nofollow" class="x" href="https://a.b">t</a>')
      ).toEqual(
        normalizeHtml('<a class="x" href="https://a.b" rel="nofollow" target="_blank">t</a>')
      )
    })

    test('should ignore indentation introduced between block elements', () => {
      expect(normalizeHtml('<ul><li><p>Item</p></li></ul>')).toEqual(
        normalizeHtml('<ul>\n <li>\n  <p>Item</p>\n </li>\n</ul>')
      )
    })

    test('should ignore indentation around the content of a block element', () => {
      expect(normalizeHtml('<p>Item</p>')).toEqual(normalizeHtml('<p>\n  Item\n</p>'))
    })

    test('should ignore the case of tag and attribute names', () => {
      expect(normalizeHtml('<P CLASS="x">t</P>')).toEqual(normalizeHtml('<p class="x">t</p>'))
    })

    test('should treat the sent and pretty-printed forms of the featured item fixture as equal', () => {
      expect(normalizeHtml(CONTENT_FIELD_WITH_ALL_TAGS)).toEqual(
        normalizeHtml(EXPECTED_CONTENT_FIELD_WITH_ALL_TAGS)
      )
    })
  })

  describe('differences that must still be detected', () => {
    test('should not ignore differing text content', () => {
      expect(normalizeHtml('<p>Item</p>')).not.toEqual(normalizeHtml('<p>Other</p>'))
    })

    test('should not ignore differing attribute values', () => {
      expect(normalizeHtml('<a href="https://a.b">t</a>')).not.toEqual(
        normalizeHtml('<a href="https://evil.example">t</a>')
      )
    })

    test('should not ignore a dropped attribute', () => {
      expect(normalizeHtml('<a rel="nofollow" href="https://a.b">t</a>')).not.toEqual(
        normalizeHtml('<a href="https://a.b">t</a>')
      )
    })

    test('should not ignore differing structure', () => {
      expect(normalizeHtml('<ul><li>a</li><li>b</li></ul>')).not.toEqual(
        normalizeHtml('<ul><li>a</li></ul>')
      )
    })

    test('should not ignore a changed tag', () => {
      expect(normalizeHtml('<strong>t</strong>')).not.toEqual(normalizeHtml('<em>t</em>'))
    })

    test('should preserve whitespace inside a preformatted block', () => {
      expect(normalizeHtml('<pre><code>  indented\n  lines</code></pre>')).not.toEqual(
        normalizeHtml('<pre><code>indented lines</code></pre>')
      )
    })

    test('should preserve whitespace that separates inline elements', () => {
      expect(normalizeHtml('<p><em>a</em> <em>b</em></p>')).not.toEqual(
        normalizeHtml('<p><em>a</em><em>b</em></p>')
      )
    })
  })
})
