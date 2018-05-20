import ToolPanel from './ToolPanel'

/**
  @param {object} overlayHints hints derived from the rendered selection.
*/
export default class Overlay extends ToolPanel {
  didMount () {
    super.didMount()

    this._positionOverlay()
  }

  didUpdate () {
    super.didUpdate()

    this._positionOverlay()
  }

  render ($$) {
    let el = $$('div').addClass('sc-overlay')
    el.addClass('sm-hidden')
    el.addClass('sm-theme-' + this.getTheme())
    el.append(
      $$('div').addClass('se-active-tools').append(
        this.renderEntries($$)
      ).ref('entriesContainer')
    )
    return el
  }

  _positionOverlay () {
    let hints = this.props.overlayHints

    if (this.hasEnabledTools()) {
      this.el.removeClass('sm-hidden')
      let overlayWidth = this.el.htmlProp('offsetWidth')
      let selRect = hints.selectionRect
      let selectionMaxWidth = selRect.width
      // By default, Overlays are aligned center/bottom to the selection
      this.el.css('top', selRect.top + selRect.height)
      let leftPos = selRect.left + selectionMaxWidth / 2 - overlayWidth / 2
      // Must not exceed left bound
      leftPos = Math.max(leftPos, 0)
      // Must not exceed right bound
      let maxLeftPos = selRect.left + selectionMaxWidth + selRect.right - overlayWidth
      leftPos = Math.min(leftPos, maxLeftPos)
      this.el.css('left', leftPos)
    } else {
      this.el.addClass('sm-hidden')
    }
  }
}
