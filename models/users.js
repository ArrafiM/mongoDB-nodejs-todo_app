const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const usersSchema = new Schema({
  nama_depan: String,
  nama_belakang:String,
  level: String,
  email: String,
  password: String,
  todos:[{
    type: Schema.Types.ObjectId,
    ref: "todos"
  }]
})

const Users = mongoose.model("users", usersSchema);
module.exports = Users;
