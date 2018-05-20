const b = require('substance-bundler')

const DIST = 'dist/'

b.task('default', ['clean', 'single-editor'])

b.task('clean', () => {
  b.rm('dist')
  b.rm('tmp')
})

b.task('assets', () => {
  b.copy('./node_modules/font-awesome', DIST + 'font-awesome')
  b.copy('./node_modules/substance/dist/*.css', DIST + 'substance/')
  b.copy('./node_modules/substance/dist/substance.js*', DIST + 'substance/')
})

b.task('substance-application', () => {
  b.js('application/index.js', {
    output: [{
      file: DIST + 'substance-application.js',
      format: 'umd',
      name: 'substanceApplication',
      globals: { 'substance': 'window.substance' }
    }],
    external: [ 'substance' ]
  })
})

b.task('single-editor', ['assets', 'substance-application'], () => {
  let DEST = DIST + 'single-doc/'
  b.copy('single-doc/index.html', DEST)
  b.css('single-doc/app.css', DEST + 'app.css')
  b.js('single-doc/app.js', {
    output: [{
      file: DEST + 'app.js',
      format: 'umd',
      name: 'singleDocumentEditor',
      globals: {
        'substance': 'window.substance',
        'substance-application': 'window.substanceApplication'
      }
    }],
    external: [ 'substance', 'substance-application' ],
    commonjs: true
  })
})
