import { BasePackage } from 'substance'
import Menu from './Menu'
import MenuGroup from './MenuGroup'
import MenuItem from './MenuItem'
import Overlay from './Overlay'
import ToggleTool from './ToggleTool'
import Toolbar from './Toolbar'
import ToolDropdown from './ToolDropdown'
import ToolGroup from './ToolGroup'

export default {
  name: 'application',

  // TODO: I want to come up with a application package that uses only components compatible with the new implementation.
  configure (configurator) {
    configurator.import(BasePackage)

    configurator.addComponent('menu', Menu, true)
    configurator.addComponent('menu-group', MenuGroup, true)
    configurator.addComponent('menu-item', MenuItem, true)
    configurator.addComponent('overlay', Overlay, true)
    configurator.addComponent('toolbar', Toolbar, true)
    configurator.addComponent('tool-dropdown', ToolDropdown, true)
    configurator.addComponent('tool-group', ToolGroup, true)
    configurator.addComponent('toggle-tool', ToggleTool, true)
  }
}
