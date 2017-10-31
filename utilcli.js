import moment from 'moment-timezone'
import 'moment/locale/es'
moment.tz.setDefault('America/Santiago')

import minimist from 'minimist'

import {templates} from './libs/templates/templates'
import {manufactureCertSteps, Cert} from './libs/store'

const argv = minimist(process.argv.slice(2), {})

async function App () {
  const action = argv._.shift()

  switch ( action ) {
    case 'regenerate-certs':
      const courseId = argv._.shift()

      const certs = await Cert.find(courseId != null ? { code: courseId } : {})

      for (const _cert of certs) {
        const cert = _cert.toObject()
        console.log( `regenerate cert ${cert.code}` )

        const template = templates.find(t=> t.meta.id === cert._template.id)

        const stepManufacture = await manufactureCertSteps(template, cert.data)

        console.log( `[${cert.code}]: Creating data...` )
        await stepManufacture.generateData({ignoreRequires: true, async loadCode () { return cert.code }})

        // console.log( `[${cert.code}]: Current data`, stepManufacture.data )

        console.log( `[${cert.code}]: Writing file...` )
        await stepManufacture.writeFile()
        console.log( `[${cert.code}]: Save changes...` )
        await stepManufacture.update()
        console.log( `[${cert.code}]: Ok` )

      }

      break
  }
}

App()
.then(() => {
  process.exit()
})
.catch((err) => {
  console.error( err.stack || err )
  process.exit(1)
})
