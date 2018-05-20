import {
  Component, SplitPane, ScrollPane, ContainerEditor
} from 'substance'
import { Managed } from 'substance-application'

export default class SingleDocumentEditor extends Component {
  getChildContext () {
    const configurator = this.props.configurator
    const editorSession = this.props.editorSession
    const componentRegistry = configurator.getComponentRegistry()
    const commandGroups = configurator.getCommandGroups()
    const iconProvider = configurator.getIconProvider()
    const labelProvider = configurator.getLabelProvider()
    const keyboardShortcuts = configurator.getKeyboardShortcuts()
    const tools = configurator.getTools()
    const surfaceManager = editorSession.surfaceManager
    return {
      get editorSession () {
        console.log('TODO: try to avoid use of "editorSession"')
        return editorSession
      },
      get configurator () {
        console.log('TODO: try to avoid using "configurator" directly')
        return configurator
      },
      // Do we really need command groups?
      // This needs some rethinking, because this grouping seems to be related
      // to tools and toolbars, which is purely visual
      // instead of commandGroups we should define toolGroups
      get commandGroups () {
        console.log('TODO: do we need "commandGroups" at all?')
        return commandGroups
      },
      // What is this?
      get tools () {
        console.log('TODO: how are "tools"?')
        return tools
      },
      // this is app specific
      get keyboardShortcuts () {
        console.log('TODO: how are "keyboardShortcuts" used?')
        return keyboardShortcuts
      },
      // surfaces are editor land
      get surfaceManager () {
        console.log('TODO: try to avoid using "surfaceManager" directly')
        return surfaceManager
      },
      // These registries/providers make sense in a general scopre,
      // and are good practise for a modular and flexible application
      componentRegistry,
      iconProvider,
      labelProvider
    }
  }

  render ($$) {
    return $$('div').addClass('sc-editor').append(
      $$('div').addClass('se-main-section').append(
        $$(SplitPane, {splitType: 'horizontal'}).append(
          this._renderToolbar($$),
          this._renderContentPanel($$)
        )
      )
    )
  }

  getComponentRegistry () {
    return this.props.configurator.getComponentRegistry()
  }

  _renderContentPanel ($$) {
    let contentPanel = $$(ScrollPane, {
      name: 'contentPanel',
      contextMenu: this.props.contextMenu || 'native',
      scrollbarPosition: 'right',
      scrollbarType: this.props.scrollbarType
    }).ref('contentPanel')

    contentPanel.append(
      this._renderEditor($$),
      this._renderOverlay($$)
    )

    return contentPanel
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    let configurator = this._getConfigurator()
    let toolPanelSepc = configurator.getToolPanel('toolbar')
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        toolPanel: toolPanelSepc,
        bindings: [
          'commandStates'
        ]
      }).ref('toolbar')
    )
  }

  _renderEditor ($$) {
    const doc = this._getDocument()
    return $$(ContainerEditor, {
      node: doc.get('body')
    }).ref('body')
  }

  _renderOverlay ($$) {
    const Overlay = this.getComponent('overlay')
    const configurator = this._getConfigurator()
    const overlaySpec = configurator.getToolPanel('overlay')
    return $$(Overlay, {
      toolPanel: overlaySpec,
      theme: 'dark'
    })
  }

  _getConfigurator () {
    return this.props.configurator
  }

  _getDocument () {
    return this.props.document
  }
}
