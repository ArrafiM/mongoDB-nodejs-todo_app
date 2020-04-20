var bcrypt = require('bcrypt');
const saltRounds = 10;
const mongoose = require('mongoose');
const User = require('../models/users');

module.exports = {
  model(req,res){
    var id = req.params.id
    User.findAll({
      where:{ id:id },
      attributes:['todos.id','todos.title'],
      include: [{
        model: Todo,
        as: 'todos'
      }],
      order: [
        ['createdAt', 'DESC'],
      ],
    })
    .then((todos) => {
      res.status(200).json({
      message:'Semua Data todos',
      todos,
     })
   })
    .catch((error) => { res.status(400).send(error); });
},
  list(req, res) {
    return User
      .find()
      .exec()
      .then((users) => {
        res.status(200).json({
          message:'Semua Data User',
          users
        })
    })
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    var id = req.params.id;
    User.findById(id)
    .exec()
    .then(result =>{
      if(!result){
        res.status(404).json({message:'User tidak Ditemukan'});
      }else{
        res.status(200).json({"Data Anda":result});
      };
    })
    .catch(err =>{
      res.status(500).json({error: err});
    })
  },

  add(req, res) {
    var Password = req.body.password;
    bcrypt.hash(Password, saltRounds, function(err, hash){
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        nama_depan: req.body.nama_depan,
        nama_belakang: req.body.nama_belakang,
        level:req.body.level,
        email: req.body.email,
        password:hash
      });
      user
      .save()
      .then(result =>{
        res.json(result);
      })
      .catch(err =>{
        res.status(400).json({error: err});
      });
      });
  },

  update(req, res) {
    var id = req.params.id;
    var Password = req.body.password;
    bcrypt.hash(Password, saltRounds, function(err, hash){
    return User
      .findById(id)      
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: 'Data Todos Tidak ditemukan',
          });
        }
        
        return User
          .update({_id: id}, {
            $set :{
              nama_depan:req.body.nama_depan, 
              nama_belakang:req.body.nama_belakang,
              level: req.body.level,
              email: req.body.email,
              password: hash
            }
          })
          .then(user => {
           res.status(200).json({
            message:'Data user Berhasil Diedit',
            user,
           })
         })
          .catch((error) => res.status(400).json(error));
      })
      .catch((error) => res.status(500).json({error: error}));
    });
  },

  delete(req, res) {
    const id = req.params.id;
    return User
      .findById(id)
      .then(user => {
        if (!user) {
            res.status(404).send({
            message: 'User Tidak Ditemukan',
          });
        }else{
        return User
          .remove({_id: id})
          .exec()
          .then(() => {
            res.json({
              message:'Data Berhasil Dihapus',
            })
          })
          .catch((err) => res.status(400).json({error:err}))  
        }   
      })
      .catch((error) => res.status(500).json({error: error}));
  },
};

