const Directive = require('./directive')

module.exports = class ImageDirective extends Directive {
  getSerializedValue () {
    return this.value
  }
}
