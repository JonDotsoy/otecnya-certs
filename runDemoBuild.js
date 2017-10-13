const util = require('util')
const fs = require('fs')
const otecnyaAprov = require('./libs/templates/otecnyaAprov/cert')

async function Run () {

  const stream = await otecnyaAprov.create({
    stream: fs.createWriteStream(`out.pdf`),
    code: '123456',
    codeOtec: '222165',
    courseName: 'Manejo A La Defensiva En Alto Montaña',
    fullName: 'Jacobo Luis Cristóbal',
    rut: '13644241-4',
  })

}

return Run()
  .then(() => {
    // Force exit if not have an error
    process.exit(0)
  })
  .catch((ex) => {
    // Show Error
    console.error(ex.stack || ex)
    // Force Exit
    process.exit(1)
  })
