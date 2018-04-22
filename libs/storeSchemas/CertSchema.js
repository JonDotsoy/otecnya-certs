const mongoose = require('mongoose')
const Schema = mongoose.Schema

const required = true
const unique = true

const CertSchema = module.exports.CertSchema = new Schema({
  path_pdf_file: {type: String, required},
  fullName: {type: String, required},
  code: {type: String, required, unique},
  rut: {type: String, required},
  createAt: {type: Date, required},
  data: {},
  _template: {type: {}, required},
})
