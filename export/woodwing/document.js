const Container = require('./container')

module.exports = class Document {
  constructor () {
    this.root = new Container()
  }

  toJson () {
    return this.root.toJson()
  }
}
