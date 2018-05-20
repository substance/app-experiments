import { Document } from 'substance'
import ParagraphPackage from './paragraph/ParagraphPackage'
import HtmlArticleImporter from './HtmlArticleImporter'

export default {
  name: 'html-article',

  configure (configurator) {
    configurator.defineSchema({
      name: 'html-article',
      DocumentClass: Document,
      // TODO: we want to get rid of this
      defaultTextType: 'paragraph',
      version: '1.0'
    })
    configurator.addImporter('html', HtmlArticleImporter)

    configurator.import(ParagraphPackage)
  }
}
