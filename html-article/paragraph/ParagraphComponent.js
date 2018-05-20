import { TextBlockComponent } from 'substance'

export default class ParagraphComponent extends TextBlockComponent {
  render ($$) {
    let el = super.render($$)
    return el.addClass('sc-paragraph')
  }

  getTagName () {
    return 'p'
  }
}
