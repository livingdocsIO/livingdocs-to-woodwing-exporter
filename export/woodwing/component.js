module.exports = class Component {
  constructor (directives, id, identifier) {
    this.directives = directives || []
    this.id = id
    this.identifier = identifier
  }

  toJson () {
    const content = {}
    this.directives.forEach((directive) => {
      const serializedValue = directive.getSerializedValue()
      content[directive.name] = serializedValue
    })
    return {styles: {}, id: this.id, identifier: this.identifier, content: content}
  }
}
