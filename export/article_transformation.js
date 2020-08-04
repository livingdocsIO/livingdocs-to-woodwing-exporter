const _find = require('lodash/find')
const _filter = require('lodash/filter')
const Document = require('./woodwing/document')
const Component = require('./woodwing/component')
const Directive = require('./woodwing/directive')
const guid = require('../lib/guid')
const ImageDirective = require('./woodwing/imageDirective')
const {mappings} = require('../mappings')

async function transformDocument ({livingdoc, uploadedImages}) {
  const wwDocument = new Document()

  livingdoc.componentTree.descendants(
    (component) => {
      const componentMappings =
        _filter(mappings, (entry) => entry.sourceType === component.componentName)
      if (componentMappings.length > 0) {
        let componentId
        componentMappings.forEach((mapping) => {

          if (componentId === undefined) {
            componentId = component.id
          } else {
            componentId = guid.next()
          }
          const directives = []

          component.directives.eachEditable((directive) => {
            const directiveMapping =
              _find(mapping.directiveMappings, (entry) => entry.source === directive.name)
            if (directiveMapping) {
              directives.push(new Directive(directiveMapping.target, directive.content.value))
            }
          })
          component.directives.eachImage((directive) => {
            const directiveMapping =
              _find(mapping.directiveMappings, (entry) => entry.source === directive.name)
            if (directiveMapping) {
              const mappedImage =
                _find(uploadedImages, (image) => image.imageComponent.id === component.id)
              if (mappedImage) {
                const content = {id: mappedImage.id, focuspoint: {x: 0.4892, y: 0.4497}}
                directives.push(new ImageDirective(directiveMapping.target, content))
              }
            }
          })

          wwDocument.root.addComponent(
            new Component(directives, componentId, mapping.targetType))
        })
      }
    }
  )

  const json = wwDocument.toJson()
  return json
}

module.exports = {transformDocument}
