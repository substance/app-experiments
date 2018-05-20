import { ApplicationPackage } from 'substance-application'
import HtmlArticlePackage from '../html-article/HtmlArticlePackage'

export default {
  name: 'single-document-editor',

  configure (configurator) {
    configurator.import(ApplicationPackage)
    configurator.import(HtmlArticlePackage)

    configurator.addToolPanel('toolbar', [
      {
        name: 'text-types',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'text-types' }
        ]
      },
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'annotations' }
        ]
      },
      {
        name: 'insert',
        type: 'tool-dropdown',
        showDisabled: true,
        style: 'descriptive',
        items: [
          { type: 'command-group', name: 'insert' }
        ]
      }
    ])
    configurator.addToolPanel('overlay', [
      {
        name: 'annotations',
        type: 'tool-group',
        showDisabled: true,
        style: 'minimal',
        items: [
          { type: 'command-group', name: 'annotations' }
        ]
      }
    ])
  }
}
