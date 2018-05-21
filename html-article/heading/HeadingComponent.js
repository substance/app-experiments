import { TextBlockComponent } from 'substance'

export default class HeadingComponent extends TextBlockComponent {
  render ($$) {
    let el = super.render($$)
    return el.addClass('sc-heading sm-level-' + this.props.node.level)
  }

  getTagName () {
    return 'h' + this.props.node.level
  }
}
