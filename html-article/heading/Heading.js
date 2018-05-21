import { TextBlock } from 'substance'

export default class Heading extends TextBlock {
  isHeading () {
    return true
  }

  getLevel () {
    return this.level
  }
}

Heading.schema = {
  type: 'heading',
  level: { type: 'number', default: 1 }
}
