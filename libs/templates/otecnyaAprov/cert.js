const PDFDocument = require('pdfkit')
const blobStream = require('blob-stream')
const toUpper = require('lodash/toUpper')
const RUT = require('rut.js')

const fs = require('fs')
const path = require('path')

module.exports.meta = {
  id: '1',
  title: 'Certificado Aprovatorio',
  image: `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, './cover.png')).toString('base64')}`,
  fields: [
      {
        name: 'fullName',
        title: 'Nombre Completo',
        type: 'text'
      },
      {
        name: 'rut',
        title: 'RUT',
        type: 'text'
      },
      {
        name: 'courseName',
        title: 'Nombre del curso',
        type: 'text'
      },
      {
        name: 'codeOtec',
        title: 'Codigo de la OTEC',
        type: 'text'
      }
    ],
}

/**
 * Create a document.
 * 
 * @param {Object} options
 * @param {string} options.fullName
 * @param {string} options.rut                 - Similar to ID number
 * @param {string} options.courseName
 * @param {string} options.codeOtec
 * @param {string} options.code
 * @param {stream} [options.stream=blobStream] - Ref: https://nodejs.org/api/stream.html
 */
module.exports.create = async function createCert (
  {
    fullName,
    rut,
    courseName,
    codeOtec,
    code,
    stream: setStream = blobStream(),
    streams: setStreams = [],
  }
) {

  const doc = new PDFDocument({
    size: [ 1056, 816 ]
  })

  const stream = doc.pipe(setStream)

  setStreams.forEach((stream) => doc.pipe(stream))

  await new Promise((resolve, reject) => {
    /* I need it to finish the promise */
    stream.once('finish', resolve)
    stream.once('error', reject)

    // stream.on('close', () => console.log('close'))
    // stream.on('drain', () => console.log('drain'))
    // stream.on('error', () => console.log('error'))
    // stream.on('finish', () => console.log('finish'))
    // stream.on('pipe', () => console.log('pipe'))
    // stream.on('unpipe', () => console.log('unpipe'))

    doc
      .image(
        `${__dirname}/certificado-aprov.png`,
        /* left */ 0,
        /* top */  0,
        {/* opts */
          width: 1056
        }
      )
      .font(`Times-Roman`)
      .fillColor('#00000')
      .fontSize(24)
      .text(
        `${toUpper(fullName)} RUT: ${RUT.format(RUT.clean(rut))}`,
        /* left */ 65.008,
        /* top  */ 385.23,
        {/* Opts */
          width: 925.984,
          align: 'center'
        }
      )
      .text(
        `${toUpper(courseName)}`,
        /* left */ 65.008,
        /* top */  492.23,
        {
          width: 925.984,
          align: 'center'
        }
      )
      .font(`${__dirname}/micross.ttf`)
      .fillColor('#847c74')
      .fontSize(13)
      .text(
        `Registro Otec N°${codeOtec}`,
        /* left */ 820,
        /* top */  526,
        {
          width: 400,
          align: 'left'
        }
      )
      .font(`${__dirname}/micross.ttf`)
      .fillColor('#847c74')
      .text(
        `Certificado N°${code}`,
        /* left */ 820,
        /* top */  543,
        {
          width: 400,
          align: 'left'
        }
      )

    doc.end()
  })

  // Return the stream element when is finish PDF file.
  return stream
}
