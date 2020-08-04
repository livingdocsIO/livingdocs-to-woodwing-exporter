module.exports = class Container {
  constructor () {
    this.components = []
  }

  addComponent (component) {
    this.components.push(component)
  }

  toJson () {
    const content = []
    this.components.forEach((component) => {
      content.push(component.toJson())
    })
    return {content: content}
  }
}
