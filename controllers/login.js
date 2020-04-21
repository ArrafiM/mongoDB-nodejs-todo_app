const User = require('../models/users');
var bcrypt = require('bcrypt');

module.exports ={


	Login(req, res) {
		var Password = req.body.password;
    return User
      .findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(400).send({ message: 'Email salah' });
        }
        var id = user.id;
        var email = user.email;
        const hash = user.password;
        bcrypt.compare(Password, hash)     
        .then(results =>{
        	if(results === true){          
            User.findById({_id:id},{attributes:['todos.id','todos.title']})
                .populate("todos", " -__v")
        		 .then((Todo) => {
               
                res.json({ message:'Berhasil Login',Todo,email })

             })
        		}else{
              res.json({ message:'Password Salah',})
            }
        	})
   		.catch((error) => { res.status(400).send(error); });
    })
  },
}