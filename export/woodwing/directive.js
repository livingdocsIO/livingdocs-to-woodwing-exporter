module.exports = class Directive {
  constructor (name, value) {
    this.name = name
    this.value = value
  }

  getSerializedValue () {
    return [{insert: this.value}]
  }
}
