const url = require('url')
const mongoose = module.exports.mongoose = require('mongoose')
const crypto = require('crypto')
const {AccountSchema} = require('./storeSchemas/AccountSchema')
const {CertSchema} = require('./storeSchemas/CertSchema')
const os = require('os')
const path = require('path')

mongoose.Promise = Promise

const textToMD5 = (data) => crypto.createHash('md5').update(data,'utf8').digest().toString('HEX')

const urlMongoDB = url.format({
  protocol: 'mongodb',
  slashes: true,
  hostname: '192.168.99.100',
  pathname: 'certs',
})

const con = module.exports.con = mongoose.createConnection(urlMongoDB, {})

// Models
const Account = module.exports.Account = con.model('accounts', AccountSchema)
const Cert = module.exports.Cert = con.model('certs', CertSchema)

const ready = (async () => {
  await con

  // default credential
  const adminusername = 'admin'
  const adminpassword = textToMD5('admin')

  let currentUserAdmin = await Account.findOne({username: adminusername}).exec()

  if (currentUserAdmin=== null) {
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

const checkLogin = module.exports.checkLogin = async ({username, password}) => {
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
