const PDFDocument = require('pdfkit')
const blobStream = require('blob-stream')
const toUpper = require('lodash/toUpper')
const RUT = require('rut.js')
const moment = require('moment-timezone')

const fs = require('fs')
const path = require('path')

module.exports.meta = {
  id: '1',
  title: 'Diploma',
  image: `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, './cover.png')).toString('base64')}`,
  fields: [
    {
      name: 'fullName',
      title: 'Nombre Completo',
      helptext: 'Juan Carlos Bodoque',
      type: 'text',
      format: toUpper,
      required: true,
    },
    {
      name: 'rut',
      title: 'RUT',
      helptext: '12.345.678-9',
      type: 'text',
      format: (value) => RUT.format(RUT.clean(value)),
      required: true,
    },
    {
      name: 'business',
      title: 'Empresa',
      helptext: 'ACHS',
      format: toUpper,
      required: true,
    },
    {
      name: 'courseName',
      title: 'Nombre del curso',
      helptext: 'MANEJO A LA DEFENSIVA EN ALTA MONTAÑA',
      type: 'text',
      format: toUpper,
      required: true,
    },
    {
      name: 'codeOtec',
      title: 'Codigo de la OTEC',
      type: 'text',
      default: '222165',
      required: true,
    },
    {
      name: 'createdAt',
      title: 'Fecha de emisión',
      type: 'date',
      get default () {
        return moment(new Date()).format('YYYY-MM-DD')
      },
      required: true,
    },
    {
      name: 'expiration',
      title: 'Fecha de expiración',
      type: 'date',
      get default () {
        return moment(new Date()).add(4, 'year').format('YYYY-MM-DD')
      },
      required: true,
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
    data,
    stream: setStream = blobStream(),
    streams: setStreams = [],
  }
) {
  const {
    fullName,
    rut,
    courseName,
    codeOtec,
    createdAt,
    expiration,
    code,
  } = data

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
        /* left */ 66.01,
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
        /* left */ 780,
        /* top */  526,
        {
          width: 600,
          align: 'left'
        }
      )
      .font(`${__dirname}/micross.ttf`)
      .fillColor('#847c74')
      .text(
        `Certificado N°${code}`,
        /* left */ 780,
        /* top */  543,
        {
          width: 600,
          align: 'left'
        }
      )
      // dates
      .font(`${__dirname}/micross.ttf`)
      .fillColor('#847c74')
      .fontSize(13)
      .text(
        `Fecha de emisión ${moment(createdAt).format('MMMM YYYY')}.`,
        /* left */ 150,
        /* top */  526,
        {
          width: 600,
          align: 'left'
        }
      )
      .font(`${__dirname}/micross.ttf`)
      .fillColor('#847c74')
      .text(
        `Fecha de expiración ${moment(expiration).format('MMMM YYYY')}.`,
        /* left */ 150,
        /* top */  543,
        {
          width: 600,
          align: 'left'
        }
      )

    doc.end()
  })

  // Return the stream element when is finish PDF file.
  return stream
}
