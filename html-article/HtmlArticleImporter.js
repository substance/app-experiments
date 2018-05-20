import { HTMLImporter } from 'substance'

// TODO: FIX this. Should be used together with configurator
export default class HtmlArticleImporter extends HTMLImporter {
  convertDocument (documentEl) {
    let body = documentEl.find('body')
    this.convertContainer(body.children, 'body')
  }
}
