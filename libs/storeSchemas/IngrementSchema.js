const mongoose = require('mongoose')
const Schema = mongoose.Schema

const required = true

const IngrementSchema = module.exports.IngrementSchema = new Schema({
  key: {type: String, required, unique: true},
  value: Number,
})
