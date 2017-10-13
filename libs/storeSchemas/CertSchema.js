const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CertSchema = module.exports.CertSchema = new Schema({
  path_pdf_file: String,
  fullName: String,
  code: String,
  rut: String,
  courseName: String,
  codeOtec: String,
})
