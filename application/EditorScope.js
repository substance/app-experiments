export default class EditorScope {
  constructor (parentScope, props, context) {
    this.id = props.id
    this.parentScope = parentScope

    this._editorSession = props.editorSession
    if (this._editorSession) {
      throw new Error('"editorSession" is required')
    }
    this._surfaceManager = props.editorSession.surfaceManager
    this._context = context
  }

  getSurfaceManager () {
    return this._surfaceManager
  }

  getDocument () {
    return this._editorSession.getDocument()
  }

  transaction (...args) {
    return this._editorSession.transaction(...args)
  }
}
