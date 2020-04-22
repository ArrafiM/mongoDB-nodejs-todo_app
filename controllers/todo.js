const Todo = require('../models/todos');
const User = require('../models/users');


module.exports = {


  list(req, res) {
    return Todo
      .find()
      .exec()
      .then((todos) => {
        res.status(200).json({
          message:'Semua Data User',
          todos
        })
    })
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    var id = req.params.id;
    Todo.findById(id)
    .exec()
    .then(result =>{
      if(!result){
        res.status(404).json({message:'data tidak Ditemukan'});
      }else{
        
        res.status(200).json({"Data Anda":result});
      };
    })
    .catch(err =>{
      res.status(500).json({error: err});
    })
  },

  add(req, res) {

    Todo.create(req.body)
    .then(function(todo) {
      
      return User.findOneAndUpdate({ _id: req.body.iduser }, 
        {$push: {todos: todo._id}}, { new: true, useFindAndModify: false }).populate("todos");
    })
    .then(function(todos) {
      
      res.json(todos);
    })
    .catch(function(err) {
      
      res.json(err);
    });

  },

  update(req, res) {
    var id = req.params.id;
    return Todo
      .findById(id)      
      .then(todo => {
        if (!todo) {
          return res.status(404).json({
            message: 'Data Todos Tidak ditemukan',
          });
        }
        return Todo
          .update({_id: id}, {
            $set :{title:req.body.title, iduser:req.body.iduser}
          })
          .then(todo => {
           res.status(200).json({
            message:'Data Berhasil Diedit',
            todo,
           })
         })
          .catch((error) => res.status(400).json(error));
      })
      .catch((error) => res.status(500).json({error: error}));
  },

  delete(req, res) {
    var id = req.params.id;
    return Todo
      .findById(id)
      .then(todo => {
        if (!todo) {
            res.status(404).send({
            message: 'Data Tidak Ditemukan',
          })
        }else{
          var userId = todo.iduser;
          console.log(userId)
          
        return Todo
          .deleteOne({_id: id})
          .exec() 
          .then(function(todo) {
            return User.findOneAndUpdate({_id:userId}, 
              { $pull: { todos: id}},
              { new: true, useFindAndModify:false },
              function(error, doc) {
                console.log('Error: ' + error);
                console.log(JSON.stringify(doc));
                res.json({
                  message:"Data Berhasil Dihapus"
                });
              });
            
          })
          
          .catch((err) => res.status(400).json({error:err}));
               
        }   
      })
      .catch((error) => res.status(500).json({error: error}));
  },
};