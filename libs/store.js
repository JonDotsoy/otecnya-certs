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
  hostname: '192.168.99.100',
  pathname: 'certs',
})

const con = module.exports.con = mongoose.createConnection(urlMongoDB, {})

// Models
const Account = module.exports.Account = con.model('accounts', AccountSchema)
const Cert = module.exports.Cert = con.model('certs', CertSchema)

Cert.manufacture = async function manufactureCertFromTemplate (template: any, data: any) {
  // Validate Data
  const dataCert = {}
  for (const field of template.meta.fields) {
    if ((field.name in data) === false) {
      throw new TypeError(`Require "${field.name}" param.`)
    } else {
      dataCert[field.name] = data[field.name]
    }
  }

  // set new data in the cert
  const CertCode: number = Number(await Cert.count()) + 22230
  dataCert.code = `${CertCode}`
  dataCert._template = {...template.meta, image: undefined}
  dataCert.path_pdf_file = path.resolve(PATHSTOREPDF, `./cert-${CertCode}.pdf`)

  // Make pdf file
  const streams = await template.create({
    ...dataCert,
    stream: fs.createWriteStream(dataCert.path_pdf_file),
  })

  // Save Cert generated
  let cert

  try {
    cert = await (new Cert(dataCert)).save()
  } catch (ex) {
    try {
      fs.unlinkSync(dataCert.path_pdf_file)
    } catch (ex) {
      console.error(ex)
    }
    throw ex
  }

  return {
    ok: true,
    data: cert.toObject(),
  }
}

const ready = (async () => {
  await con

  // default credential
  const adminusername = 'admin'
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
