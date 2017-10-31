// @flow
const t = require('flow-runtime')
const url = require('url')
const mongoose = module.exports.mongoose = require('mongoose')
const crypto = require('crypto')
const {AccountSchema} = require('./storeSchemas/AccountSchema')
const {CertSchema} = require('./storeSchemas/CertSchema')
const os = require('os')
const fs = require('fs')
const path = require('path')

// Folder to out files
const PATHSTOREPDF: string = process.env.STORE_FILES || os.tmpdir()

mongoose.Promise = Promise

const textToMD5 = (data: Buffer|string) => crypto.createHash('md5').update(data,'utf8').digest().toString('HEX')

// Format Mongo URL
const urlMongoDB: string = url.format({
  protocol: 'mongodb',
  slashes: true,
  hostname: process.env.DB_HOST || '192.168.99.100',
  pathname: process.env.DB_NAME || 'certs',
})

const con = module.exports.con = mongoose.createConnection(urlMongoDB, {})

// Models
const Account = module.exports.Account = con.model('accounts', AccountSchema)
const Cert = module.exports.Cert = con.model('certs', CertSchema)

export async function manufactureCertSteps (template: any, data: any) {
  // Validate Data
  const certData = {
    createAt: new Date(),
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
        CertCode = `${ Number(await Cert.count()) + 23230 }`
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
