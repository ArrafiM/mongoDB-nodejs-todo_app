const User = require('../models/users');
const Todo = require('../models/todos');
var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	home(req, res) {
	var userId= req.session.userId;
	if(req.session.loggedin){
    return User
      .findById({ _id:userId },{attributes:['todos.id','todos.title']})
        .populate("todos", " -__v")
        .then((todos) => {
          
            res.render('user/dashboard.ejs',{data:todos.todos}); 
            // var data = todos.todos;
            // console.log(data[1]);

        })
      .catch((error) => { res.status(400).send(error); });
  	}else{
  		res.redirect('/login');
  	}
  },

  add(req, res){
  	if(req.method == "POST"){
  	var data = req.body;
  	var userId= req.session.userId;
      return Todo
      .create({
        title: data.title,
        iduser: userId,
      })
      .then(function(todo) {
      
        return User.findOneAndUpdate({ _id: userId }, 
          {$push: {todos: todo._id}}, { new: true }).populate("todos");
      })
      .then((data) => {
        res.redirect('/dashboard');
      })
      .catch((error) => res.status(400).send(error));
  	}else{
	  	var message = '';
	   	if (req.session.loggedin) {
	   
	      res.render('user/tambah.ejs',{message: message});	
	 	} else {			
	      res.redirect('/login');
	 	}
  	}
  },

  edit(req, res){
  	if(req.method == "POST"){
  		var userId = req.session.userId;
  		return Todo
          .update({_id: req.params.id}, {
            $set :{title:req.body.title, iduser:userId}
          })
          .then(() => {
           res.redirect('/dashboard');
         })
          .catch((error) => res.status(400).send(error));
     
  	}else{
  		if (req.session.loggedin) {
  			var Id = req.params.id;

  			return Todo
  			.find({ _id:Id })
        .populate("todos", " -__v")

      		.then((todos) => {
              res.render('user/update.ejs',{data:todos});
             })
  		}
  	}
  },

  hapus(req, res){
  	var userId= req.session.userId;
  	if(req.session.loggedin){
      User.findById({ _id:userId })
      .populate("todos", " -__v")

          .then((todos) => {
              res.render('user/hapus.ejs',{data:todos.todos});
            })
      .catch((error) => { res.status(400).send(error); });
  	}else{
  		res.redirect('/login');
  	}
  	
  },
  delete(req, res){
    var id = req.params.id;
    return Todo
          .remove({_id: id})
          .exec()
          .then(() => {
           res.redirect('/dashboard');
         })
          .catch((error) => res.status(400).send(error));
     
  },

  profile(req,res){
  	if(req.session.loggedin){
  	var userId = req.session.userId;
    return User
    .find({ _id:userId })
     .then((todos) => {
            var results = todos;
            res.render('user/profile.ejs',{data:results});
            })
      .catch((error) => { res.status(400).send(error); });
  }else{
  	res.redirect('/login');
  }
  },

  editProfile(req,res){
  	if(req.method == "POST"){
  	var userId = req.session.userId;
  	var Password = req.body.password;
    bcrypt.hash(Password, saltRounds, function(err, hash){
    return User
    .update({_id: userId}, {
      $set :{
        nama_depan:req.body.nama_depan, 
        nama_belakang:req.body.nama_belakang, 
        password: hash
      }
    })
          .then(() => {
            res.redirect('/dashboard/profile');
          })
          .catch((error) => res.status(400).send(error));
     
    })
  	}else{
  		if(req.session.loggedin){
  		var userId = req.session.userId;
    	return User
      .find({ _id:userId })
     	.then((todos) => {
            	var results = todos;
            	res.render('user/edit.ejs',{data:results});
            	})
      		.catch((error) => { res.status(400).send(error); });
  		}else{
  			res.redirect('/login');
  		}
  		
  	}
  },



}