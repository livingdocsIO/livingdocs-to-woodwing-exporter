const chai = require('chai')
const expect = chai.expect
const chaiExclude = require('chai-exclude')
chai.use(chaiExclude)

const liSDK = require('@livingdocs/node-sdk')
const {transformDocument} = require('../export/article_transformation')

describe('article transformation', function () {
  describe('transform document', function () {
    it('should return title with text', async function () {
      const publication = require('./publication').getPublication()
      const design = require('./livingtimes.1.0.2.json')
      const livingdoc = liSDK.document.create({content: publication.content, design})
      const expectedResult = {content: [{
        content: {
          text: [{
            insert: 'test12345678901234567'
          }]
        },
        id: 'doc-1edbka9ie1',
        identifier: 'title',
        styles: {}
      },
      {
        content: {
          text: [{
            insert: 'test lead'
          }]
        },
        id: 'doc-1edbka9ie1',
        identifier: 'intro',
        styles: {}
      },
      {
        content: {
          caption: [{insert: undefined}]
        },
        id: 'doc-1edbka9if0',
        identifier: 'image',
        styles: {}
      },
      {
        content: {
          text: [{
            insert: 'test'
          }]
        },
        id: 'doc-1edbka9if1',
        identifier: 'body-crosshead',
        styles: {}
      }]}

      const result = await transformDocument({livingdoc})

      expect(result).excludingEvery(['id']).to.deep.equal(expectedResult)
    })
  })
})
