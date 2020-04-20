const mongoose = require('mongoose');

const todosSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  iduser:String
});

module.exports = mongoose.model('todos', todosSchema);