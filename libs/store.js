// @flow
const config = require('../config')
const t = require('flow-runtime')
const url = require('url')
const mongoose = module.exports.mongoose = require('mongoose')
const crypto = require('crypto')
const {AccountSchema} = require('./storeSchemas/AccountSchema')
const {CertSchema} = require('./storeSchemas/CertSchema')
const {IngrementSchema} = require('./storeSchemas/IngrementSchema')
const fs = require('fs')
const path = require('path')

// Folder to out files
const PATHSTOREPDF: string = config.store_file

mongoose.Promise = Promise

const textToMD5 = (data: string|Buffer|DataView) => crypto.createHash('md5').update(data,'utf8').digest().toString('HEX')

// Format Mongo URL
const urlMongoDB: string = config.mongo_uri

const con = module.exports.con = mongoose.createConnection(urlMongoDB, {})

// Models
const Account = module.exports.Account = con.model('accounts', AccountSchema)
const Cert = module.exports.Cert = con.model('certs', CertSchema)
const Increment = module.exports.Increment = con.model('ingrements', IngrementSchema)

Increment.nextIncrementValue = async function IncrementNextIncrementValue (key: string) {
  const IngrementCertIds = await Increment.findOne({key})
  const currentValue = IngrementCertIds.value
  const nextValue = currentValue + 1

  await Increment.update({key, value: nextValue})

  return nextValue
}

PrepareDB()
async function PrepareDB () {
  console.log('Preparing DBs')
  console.log('Preparing Increment')
  const IngrementCertIds = await Increment.findOne({key: 'cert_ids'})
  if (IngrementCertIds === null) {
    console.log(`cert_ids not exists`)
    const certs = await Cert.find({})

    let initialIdCounter = 0
    console.log('inspect certs')
    for (const cert of certs) {
      if (Number(cert.code) > initialIdCounter) {
        initialIdCounter = Number(cert.code)
      }
    }
    console.log('Is determinate initial id is ' + initialIdCounter + 1)
    await Increment.create({
      key: 'cert_ids',
      value: initialIdCounter,
    })
  }
}

export async function manufactureCertSteps (template: any, data: any) {
  // Validate Data
  const certData = {
    createAt: new Date(),
    /** @type {string|void} */
    path_pdf_file: undefined,
    fullName: undefined,
    code: undefined,
    rut: undefined,
    data: {},
    _template: null,
  }

  return {
    get data () {
      return certData
    },
    async generateData (opts = {}) {
      const loadCode = opts.loadCode

      for (const field of template.meta.fields) {
        if (opts.ignoreRequires !== true) {
          if (field.required === true && (field.name in data) === false) {
            throw new TypeError(`Require "${field.name}" param.`)
          }
        }

        certData.data[field.name] = data[field.name]

        switch (field.name) {
          case 'rut':
          case 'fullName':
            certData[field.name] = data[field.name]
        }
      }

      // prepare next id number
      let CertCode: string|number
      if (typeof loadCode === 'function') {
        CertCode = await loadCode()
      } else {
        CertCode = `${ await Increment.nextIncrementValue('cert_ids') }`
      }

      certData.code = certData.data.code = `${CertCode}`
      certData._template = {...template.meta, image: undefined}
      certData.path_pdf_file = path.resolve(PATHSTOREPDF, `./cert-${CertCode}.pdf`)
    },
    async writeFile () {
      // Make PDF file
      const streams = await template.create({
        data: certData.data,
        stream: fs.createWriteStream(certData.path_pdf_file),
      })

      return streams
    },
    async update () {
      return await Cert.update({ code: certData.code }, certData)
    },
    async save () {
      // Save Cert generated
      let cert

      try {
        cert = await (new Cert(certData)).save()
      } catch (ex) {
        try {
          // Has error remove the file created
          fs.unlinkSync(certData.path_pdf_file)
        } catch (ex) {
          console.error(ex)
        }
        throw ex
      }

      return cert
    }
  }
}

Cert.manufacture = async function manufactureCertFromTemplate (template: any, data: any) {
  const e = await manufactureCertSteps(template, data)

  await e.generateData()
  await e.writeFile()

  const cert = await e.save()

  return {
    ok: true,
    data: cert.toObject(),
  }
}

const ready = (async () => {
  await con

  // default credential
  const adminusername = 'admin'
  if (typeof loadCode === 'function') {

  }
  const adminpassword = textToMD5('admin')

  let currentUserAdmin = await Account.findOne({username: adminusername}).exec()

  if (currentUserAdmin === null) {
    const admin = new Account({
      username: adminusername,
      password: adminpassword,
    })

    currentUserAdmin = await admin.save()
  }

  return {
    connections: {
      default: con,
    },
    models: {
      Account,
    },
  }
})()

interface Auth {
  username: string,
  password: string
}

const checkLogin = module.exports.checkLogin = async ({username, password}: Auth) => {
  let ok = false

  const user = await Account.findOne({username})

  if (user) {
    ok = user.username === username && user.password === textToMD5(password)
  }

  return {
    ok,
    user,
  }
}

module.exports.ready = ready
