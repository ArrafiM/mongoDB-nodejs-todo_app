const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const todosSchema = new Schema({
  title: String,
  iduser: {
    type: String,
    required: true
  }
})

const Todos = mongoose.model("todos", todosSchema);
module.exports = Todos;