const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = module.exports.AccountSchema = new Schema({
  username: String,
  password: String,
})
