import { Component } from 'substance'

const _ManagedComponentCache = new Map()

/*
  Example:
  ```
  $$(Managed(Toolbar), { bindings: ['commandState'] })
  ```
  `commandStates` will be taken from the app-state, and merged with the other props.
  When `commandStates` is changed, Toolbar automatically will be rerendered automatically via extendProps.
*/
export default function Managed (ComponentClass) {
  if (_ManagedComponentCache.has(ComponentClass)) return _ManagedComponentCache.get(ComponentClass)

  // an anonymous class that takes care of mapping props that start with $
  class ManagedComponent extends Component {
    constructor (...args) {
      super(...args)

      this._compileManagedProps(this.props)
      this._deriveManagedProps(this.props)
    }

    didMount () {
      const editorSession = this.context.editorSession
      // EXPERIMENTAL
      // not clear yet how to deal with props that are bound to different stages
      // let's first get this working with one stage
      // then move on with the new Flow implementation
      // after that, there should not be need for stages defined by observers, only for reducers
      // register data bindings
      if (this._managedProps) {
        editorSession.on(this._managedProps.stage, this._onChange, this)
      }
    }

    willReceiveProps (newProps) {
      this._compileManagedProps(newProps)
      this._deriveManagedProps(newProps)
    }

    dispose () {
      // unregister data bindings
      this.context.editorSession.off(this)
    }

    render ($$) {
      return $$(ComponentClass, this._props).ref('managed')
    }

    _onChange (editorSession) {
      let managedPropNames = this._managedProps.propNames
      for (var i = 0; i < managedPropNames.length; i++) {
        if (editorSession.hasChanged(managedPropNames[i])) {
          this._deriveManagedProps()
          this.refs.managed.extendProps(this._props)
          break
        }
      }
    }

    _compileManagedProps (props) {
      let stage = 'render'
      let propNames = []
      if (props.bindings) {
        props.bindings.forEach(name => {
          propNames.push(name)
        })
      }
      if (propNames.length > 0) {
        this._managedProps = { stage, propNames }
      } else {
        this._managedProps = null
        this.context.editorSession.off(this)
      }
    }

    _deriveManagedProps (props) {
      const editorSession = this.context.editorSession
      const managedProps = this._managedProps
      if (managedProps) {
        let derivedProps = Object.assign({}, props)
        managedProps.propNames.forEach(name => {
          derivedProps[name] = editorSession.get(name)
        })
        this._props = derivedProps
      } else {
        this._props = props
      }
    }
  }

  _ManagedComponentCache.set(ComponentClass, ManagedComponent)

  return ManagedComponent
}
