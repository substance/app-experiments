import { Component } from 'substance'

export default function inheritComponentContextsPatch () {
  Component.prototype._getContext = function () {
    var context = {}
    var parent = this.getParent()
    if (parent) {
      if (parent.getChildContext !== Component.prototype.getChildContext) {
        context = parent.getChildContext()
        context.__proto__ = parent.context // eslint-disable-line no-proto
      } else {
        context = parent.context
      }
    }
    return context
  }
}
