const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nama_depan: String,
  nama_belakang:String,
  level: String,
  email: String,
  password: String
});

module.exports = mongoose.model('users', usersSchema);
