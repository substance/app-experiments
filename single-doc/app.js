import { EditorSession, substanceGlobals, platform } from 'substance'
import { Configurator } from 'substance-application'
import SingleDocumentEditorPackage from './SingleDocumentEditorPackage'
import SingleDocumentEditor from './SingleDocumentEditor'
import { inheritComponentContextPatch } from '../legacy/index'

const html = `<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <p id="p1">abc</p>
    <p id="p2">def</p>
    <p id="p3">ghi</p>
  </body>
</html>
`

window.onload = () => {
  // enable some debugging when the console is open
  if (platform.devtools) {
    // better stack traces for Component.render()
    substanceGlobals.DEBUG_RENDERING =
    // use inheritance instead of cloning Component contexts
    // this allows us to pass down a context which raises deprecation warnings
    inheritComponentContextPatch()
  }

  // configuration
  let configurator = new Configurator()
  configurator.import(SingleDocumentEditorPackage)

  // sample document
  let importer = configurator.createImporter('html')
  let document = importer.importDocument(html)

  // TODO: configuration, loading a document, setting upp editor sessions etc.
  // should be done by the application
  let editorSession = new EditorSession(document, { configurator })
  SingleDocumentEditor.mount({ editorSession, configurator, document }, window.document.body)
}
