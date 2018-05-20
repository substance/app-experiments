import { Configurator as SubstanceConfigurator, isString, flatten } from 'substance'

export default class Configurator extends SubstanceConfigurator {
  constructor () {
    super()

    this._compiledToolPanels = {}
  }

  addTool (name, ToolClass) {
    if (!isString(name)) {
      throw new Error("Expecting 'name' to be a String")
    }
    if (!ToolClass) {
      throw new Error('Provided nil for tool ' + name)
    }
    if (!ToolClass || !ToolClass.prototype._isTool) {
      throw new Error("Expecting 'ToolClass' to be of type Tool. name:", name)
    }

    this.config.tools[name] = ToolClass
  }

  getTools () {
    return this.config.tools
  }

  addToolPanel (name, spec) {
    this.config.toolPanels[name] = spec
  }

  getToolPanel (name) {
    let toolPanelSpec = this.config.toolPanels[name]
    if (!toolPanelSpec) throw new Error('No toolpanel is registered by this name: ' + name)
    // return cache compiled tool-panels
    if (this._compiledToolPanels[name]) return this._compiledToolPanels[name]
    let toolPanel = toolPanelSpec.map(itemSpec => this._compileToolPanelItem(itemSpec))
    this._compiledToolPanels[name] = toolPanel
    return toolPanel
  }

  getCommandGroup (name) {
    let commandGroup = this.config.commandGroups[name]
    if (!commandGroup) {
      console.warn('No command group registered by this name: ' + name)
      commandGroup = []
    }
    return commandGroup
  }

  _compileToolPanelItem (itemSpec) {
    let item = Object.assign({}, itemSpec)
    let type = itemSpec.type
    switch (type) {
      case 'command-group':
        return this.getCommandGroup(itemSpec.name).map(commandName => {
          return { commandName }
        })
      case 'tool-group':
      case 'tool-dropdown':
        item.items = flatten(itemSpec.items.map(itemSpec => this._compileToolPanelItem(itemSpec)))
        break
      default:
        throw new Error('Unsupported tool panel item type: ' + type)
    }
    return item
  }
}
