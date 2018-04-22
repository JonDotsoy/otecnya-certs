const path = require('path')
const url = require('url')
const os = require('os')

require('dotenv').config({
  path: path.resolve( `${__dirname}/.env` ),
});

module.exports = {
  /** @type {string} */
  mongo_uri: process.env.DB_URI || url.format({
    protocol: 'mongodb',
    slashes: true,
    hostname: process.env.DB_HOST || '192.168.99.100',
    pathname: process.env.DB_NAME || 'certs',
  }),
  /** @type {string} */
  store_file: process.env.STORE_FILES || os.tmpdir(),
  /** @type {string} */
  secret_key_session: process.env.SECRET_KEY_SESSION || '123456',
}
