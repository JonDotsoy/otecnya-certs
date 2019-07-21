const PDFDocument = require('pdfkit')
const blobStream = require('blob-stream')
const RUT = require('rut.js')
const moment = require('moment-timezone')
const toUpper = require('lodash/toUpper')
const capitalize = require('lodash/capitalize')
const startCase = require('lodash/startCase')
const upperFirst = require('lodash/upperFirst')
const fs = require('fs')
const path = require('path')

const OTECNYANAME = 'Capacitaciones Otecnya Ltda'
const OTECNYARUT  = RUT.format(RUT.clean('76.472.186-1'))

const AprobadoReprobadoList = ['Aprobado', 'Reprobado']

function nomalizeTypeClass (val) {
  if (Array.isArray(val)) {
    return toUpper(val.join('/'))
  } else {
    return toUpper(val)
  }
}

const meta = module.exports.meta = {
  id: '2',
  title: 'Certificado de Competencias',
  image: `data:image/png;base64,${fs.readFileSync(path.resolve(__dirname, './cover2.png')).toString('base64')}`,
  fields: [
    {
      name: 'fullName',
      title: 'Nombre Completo',
      helptext: 'Juan Carlos Bodoque',
      type: 'text',
      format: capitalize,
      required: true,
    },
    {
      name: 'rut',
      title: 'RUT',
      helptext: '11.111.111-1',
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
      name: 'licMuniClase',
      title: 'Clase (Licencia Municipalidad)',
      helptext: 'B/D',
      type: 'checkbox',
      format: nomalizeTypeClass,
      list: [ 'B', 'C', 'D', 'E', 'A1', 'A2', 'A3', 'A4', 'A5' ]
    },
    {
      name: 'licMuniOtorgada',
      title: 'Otorgada (Licencia Municipalidad)',
      helptext: 'Municipalidad de Paillaco',
      type: 'text',
      required: true,
    },
    {
      name: 'licMuniRestricciones',
      title: 'Restricciones (Licencia Municipalidad)',
      helptext: 'Sin Restricciones',
      type: 'text',
      list: [
        'Sin Restricciones',
        'Debe usar lentes'
      ],
      required: true,
    },
    {
      name: 'licMuniControlDate',
      title: 'Fecha de Control (Licencia Municipalidad)',
      helptext: moment().format('l'),
      type: 'date',
      get default () {return moment().format('YYYY-MM-DD')},
      required: true,
    },
    {
      name: 'licEquipMarca',
      title: 'Marca (Identificación del Equipo)',
      helptext: 'MOTONIVELADORA / CATERPILLAR / 140 M / 2016',
      type: 'text',
      list: [
        "RODILLOS / HAMM / 3412 / 2011",
        "RODILLOS / HAMM / 3520 / 2008",
        "RODILLOS / BOMAG / BW219DH4 / 2013",
        "MOTONIVELADORA / CATERPILLAR / 140 M / 2015",
        "MOTONIVELADORA / CATERPILLAR / 140 M / 2016",
        "MOTONIVELADORA / CATERPILLAR / 120 M / 2017",
        "CARGADOR FRONTAL / KOMATSU / WA380 / 2017",
        "CARGADOR FRONTAL / JHON DEERE / 744 K / 2012",
        "CARGADOR FRONTAL / CATERPILLAR / L 966 / 2017",
        "CAMION LUBRICADOR / CHEVROLET / NQR 908 / 2010",
        "TRACTO CAMION / MAN / TGS 33 540 / 2015",
        "TRACTO CAMION / EAGER BEAVER / GLS 60 / 2016",
        "RETRO EXCAVADORA / CATERPILLAR / MOD 416 F / 2017",
        "BULLDOZER / CATERPILLAR / D8T / 2011",
        "CAMION COMBUSTIBLE / MERCEDES BENZ / ATEGO 1624 / 2017",
        "CAMION TOLVA / MERCEDES BENZ / ACTROS 4144 K / 2017",
        "CAMION LIBRE / MERCEDES BENZ / ACTROS 3336 K / 2012",
        "EXCAVADORES / KOMATSU / PC450LC-8 / 2013",
        "EXCAVADORES / KOMATSU / PC450LC-8 / 2014",
        "EXCAVADORES / KOMATSU / PC450LC-8 / 2015",
        "EXCAVADORES / KOMATSU / PC450LC-8 / 2016",
        "EXCAVADORES / KOMATSU / PC450LC-8 / 2017",
        "EXCAVADORES / KOMATSU / PC300 / 2012",
        "EXCAVADORES / KOBELCO / SK210M / 2011",
        "EXCAVADORES / HYUNDAI / ROBEX 330 LC 95 / 2015",
        "EXCAVADORES / HYUNDAI / ROBEX 330 LC 95 / 2016",
        "EXCAVADORES / HYUNDAI / ROBEX 330 LC 95 / 2017",
        "EXCAVADORES / CATERPILLAR / 390 L / 2013",
        "EXCAVADORES / CATERPILLAR / 323 D / 2017",
        "EXCAVADORES / CATERPILLAR / 330 D / 2017",
      ],
      required: true,
    },
    {
      name: 'resultEvaluationConocimientoDelEquipo',
      title: 'Conocimiento del equipo (Evaluados Teórico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'resultEvaluationHabilidaddeOperacion',
      title: 'Habilidad de Operación (Evaluados Practico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'resultEvaluationSeguridadOperacionaldelEquipo',
      title: 'Seguridad Operacional del Equipo (Evaluados Teórico/Practico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'resultEvaluationAislacionBloqueoPermisodeTrabajo',
      title: 'Aislación/Bloqueo/Permiso de Trabajo (Evaluados Teórico/Practico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'resultEvaluationAlturaFisicaEnEquipos',
      title: 'Altura Física en Equipos (Evaluados Teórico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'resultEvaluationOperacionEquipoPesado',
      title: 'Operación Equipo Pesado (Evaluados Teórico/Practico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'resultEvaluationControlDeIncendioEnEquipo',
      title: 'Control de Incendio en Equipo (Evaluados Teórico)',
      helptext: 'Aprobado',
      default: 'Aprobado',
      list: AprobadoReprobadoList,
      required: true,
    },
    {
      name: 'capacitationDuracion',
      title: 'Duración',
      helptext: '6 Horas',
      list: Array(8).fill(0).map((e,i)=>`${i + 1} Horas`),
      required: true,
    },
    {
      name: 'capacitationEmpresaSolicitante',
      title: 'Empresa Solicitante',
      helptext: 'CONSORCIO CONPAX OHL VALKO S.A',
      default: 'CONSORCIO CONPAX OHL VALKO S.A',
      format: toUpper,
      required: true,
    },
    {
      name: 'capacitationRutEmpresaSolicitante',
      title: 'Rut Empresa Solicitante',
      helptext: '12.345.678-9',
      default: '76.447.709-K',
      type: 'text',
      format: (value) => RUT.format(RUT.clean(value)),
      required: true,
    },
    {
      name: 'createdAt',
      title: 'Fecha de Certificación',
      type: 'date',
      get default () {
        return moment(new Date()).format('YYYY-MM-DD')
      },
      required: true,
    },
    {
      name: 'expiration',
      title: 'Fecha de vencimiento Certificación',
      type: 'date',
      get default () {
        return moment(new Date()).add(1, 'year').format('YYYY-MM-DD')
      },
      required: true,
    },
  ]
}

module.exports.create = async ({
  data,
  stream: setStream = blobStream(),
  streams: setStreams = [],
}) => {

  // format data

  const {
    code,
    fullName,
    rut,
    licMuniClase,
    licMuniOtorgada,
    licMuniRestricciones,
    licMuniControlDate,
    licEquipMarca: licEquip,
    // licEquipModelo,
    // licEquipAno,
    resultEvaluationConocimientoDelEquipo,
    resultEvaluationHabilidaddeOperacion,
    resultEvaluationSeguridadOperacionaldelEquipo,
    resultEvaluationAislacionBloqueoPermisodeTrabajo,
    resultEvaluationAlturaFisicaEnEquipos,
    resultEvaluationOperacionEquipoPesado,
    resultEvaluationControlDeIncendioEnEquipo,
    capacitationDuracion,
    capacitationEmpresaSolicitante,
    capacitationRutEmpresaSolicitante,
    createdAt,
    expiration
  } = data

  const [licEquipType, licEquipMarca, licEquipModelo, licEquipAno] = licEquip.split(' / ')

  const doc = new PDFDocument({
    size: [ 816, 1056 ]
  })

  const stream = doc.pipe(setStream)

  setStreams.forEach((stream) => doc.pipe(stream))

  await new Promise((resolve, reject) => {
    /* I need it to finish the promise */
    stream.once('finish', resolve)
    stream.once('error', reject)

    try {
      // Include Base image
      doc.image(__dirname + '/baseCert.png', 0, 0)

      doc.text(`Certificado N°${code}`, 48.431, 850, {width: 300, align: 'left'})

      // 25 de agosto 2017
      doc.text(`Santiago ${moment(createdAt).format('DD [de] MMMM YYYY')}, ${OTECNYANAME}, Rut ${OTECNYARUT}, extiende el presente certificado de aprobación de instrumentos de evaluación y observación de competencias para la operación de ${licEquipType}, Según se detalla a continuación:`,
        48.431,
        144.777,
        {
          width: 697.402,
          align: 'left'
        }
      )

      const configLineType1 = (param, value, top) => doc
        .text(param,
          48,
          top,
          {
            width: 700,
            align: 'left',
          }
        )
        .text(`${value}.`,
          283.507,
          top,
          {
            width: 700,
            align: 'left',
          }
        )

      configLineType1(`Nombre:`, upperFirst(fullName), 228)
      configLineType1(`Rut:`, RUT.format(RUT.clean(rut)), 244)
      configLineType1(`Clase:`, nomalizeTypeClass(licMuniClase), 297)
      configLineType1(`Otorgada:`, licMuniOtorgada, 313)
      configLineType1(`Restricciones:`, licMuniRestricciones, 330)
      configLineType1(`Fecha de Control:`, moment(licMuniControlDate).format('L'), 347)
      configLineType1(`Marca:`, licEquipMarca, 400)
      configLineType1(`Modelo:`, toUpper(licEquipModelo), 417)
      configLineType1(`Año:`, licEquipAno, 433)


      const configLineTable1 = (aspecto, type, evaluacion, top) => doc
        .text(aspecto,
          55.837,
          top,
          {
            width: 237.351,
            align: 'left'
          }
        )
        .text(type,
          294.719,
          top,
          {
            width: 169.469,
            align: 'center'
          }
        )
        .text(evaluacion,
          464.828,
          top,
          {
            width: 184.179,
            align: 'center'
          }
        )

      let e = 517, i = 17.3

      configLineTable1('Conocimiento del equipo ', 'Teórico', resultEvaluationConocimientoDelEquipo, e)
      configLineTable1('Habilidad de Operación', 'Practico', resultEvaluationHabilidaddeOperacion, e += i)
      configLineTable1('Seguridad Operacional del Equipo', 'Teórico/Practico', resultEvaluationSeguridadOperacionaldelEquipo, e += i)
      configLineTable1('Aislación/Bloqueo/Permiso de Trabajo', 'Teórico/Practico', resultEvaluationAislacionBloqueoPermisodeTrabajo, e += i)
      configLineTable1('Altura Física en Equipos', 'Teórico', resultEvaluationAlturaFisicaEnEquipos, e += i)
      configLineTable1('Operación Equipo Pesado', 'Teórico/Practico', resultEvaluationOperacionEquipoPesado, e += i)
      configLineTable1('Control de Incendio en Equipo', 'Teórico', resultEvaluationControlDeIncendioEnEquipo, e += i)

      const configLineTable2 = (activity, value, top) => doc
        .text(activity,
          56.808,
          top,
          {
            width: 282.312,
            align: 'left',
          }
        )
        .text(value,
          350.504,
          top,
          {
            width: 282.312,
            align: 'left',
          }
        )

      let a = 736, b = 17.4
      configLineTable2('Duración', capacitationDuracion, a)
      configLineTable2('Fecha de Certificación', moment(createdAt).format('L'), a += b)
      configLineTable2('Fecha de vencimiento Certificación', moment(expiration).format('L'), a += b)
      configLineTable2('Empresa Solicitante', toUpper(capacitationEmpresaSolicitante), a += b)
      configLineTable2('Rut Empresa Solicitante', RUT.format(RUT.clean(capacitationRutEmpresaSolicitante)), a += b)

      doc.end()
    } catch (ex) {
      reject(ex)
    }
  })
}

