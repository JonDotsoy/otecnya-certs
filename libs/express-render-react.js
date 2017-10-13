
const ReactDOMServer = require('react-dom/server')
const {ServerStyleSheet} = require('styled-components')

/* Permite renderizar usando React */
module.exports = function expressRenderReact (req, res, next) {
  res.renderReact = (comp, opts = {}) => {
    const {
      lang = 'en',
      title = 'Document',
      charset = 'UTF-8',
      viewport = 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
    } = opts

    const sheet = new ServerStyleSheet()
    const html = ReactDOMServer.renderToString(sheet.collectStyles(comp))
    const StyleTags = sheet.getStyleTags()

    res
      .type('html')
      .send(
        `<!DOCTYPE html><html lang="${lang}"><head><meta name="viewport" content="${viewport}"/><meta charset="${charset}"/><title>${title}</title>${StyleTags}</head><body><div id="app">${html}</div></body></html>`
      )
  }

  console.log(`[${req.method}] ${req.path}`)

  next()
}