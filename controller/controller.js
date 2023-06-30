const User = require('../models/User');
const Deposit = require('../models/deposit');
const wallets = require('../models/wallet');
const  bcrypt= require('bcrypt');
const  Mongoose  = require('mongoose');
const  mongodb= require("mongodb"); 
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { constant } = require('lodash');
const secret = 'Tradexcellent';
//handle errors
   const handleErrors = (err) =>{
       console.log(err.message, err.code);
       let errors = {email:'',password:''};

  // duplicate error code

  if(err.code ===11000){
      errors.email = 'that email is already registred';
      return errors;
  }
    // valiadate email and pasww

    if (err.message === 'incorrect email'){
        errors.email = 'incorrect email';
    }
    if (err.message === 'incorrect password'){
        errors.password = 'incorrect password';
    }

  // validate errors
  if(err.message.includes('user validate failed')){
      Object.values(err.errors).forEach(({properties}) =>{
        errors[properties.path] = properties.message;
      });
  }
     return errors;
   }



const maxAge = 60*60;
const createToken = (email) =>{
    return jwt.sign({email},'Tradexcellent',{
      expiresIn : maxAge
    });
}

module.exports.register_get= (req,res) =>{
     res.render('register')
}

/*exports.find =(req,res)=>{
     if(req.query.id){
          const id = req.query.id;
          User.find({})
          .then(data =>{
               if(!data){
                    res.status(404).send({message:"not found user"})
               }else{
                    console.log(data);
                    res.send(data)
               }
          })
          .catch(err =>{
               res.status(500).send({message:"error retrieve user"})
          })
     }
}
*/

/*module.exports.update= (req,res)=>{/*
    const {wallet} = req.body;
    const id = req.params.id;

        
          wallets.findByIdAndUpdate(id, {
            $set:{wallet:wallet}
          },{useFindAndModify:false},
          (err,data)=>{
               if(!err){
                    res.render('../admin/wallet.ejs',{users:data});
               }else{
                    console.log(err);
               }
          }
             
              )
        }
        */
module.exports.delete = (req,res)=>{
    const id = req.params.id;
    User.findByIdAndDelete(id)
    .then(data=>{
         if(!data){
              res.status(400).send({message:`cannot delete with ${id}`})
         }else{
              res.send({message:"user was deleted successfully!"})
         }
    }) 
    .catch(err=>{
         res.status(500).send({message:"could not delete user with id=" +id})
    })
}
module.exports.register_post = async (req,res) =>{
   const {firstname,lastname,username,email}= req.body;
   const salt = await bcrypt.genSalt(10);
   const password =  await bcrypt.hash(req.body.password,salt);
         
         
   try{
   const user = await User.create({firstname,lastname,username,email,password});
   const token = createToken(user.email);
   res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000});
   res.status(201).json({user:user.email});
   }
   catch(err){
        const errors= handleErrors(err);
        res.status(400).json({errors});
   }
                      
      
}  
module.exports.login_get=  (req,res) =>{
     res.render('login')
}
module.exports.login_post = async (req,res) =>{
     const {email,password} = req.body;

     try{
          const user = await User.login(email,password);
          const token = createToken(user.email);
          res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge * 1000});
          res.status(200).json({user:user.email});
     }
     catch(err){
          const errors = handleErrors(err);
          res.status(400).json({errors});
     }

}

/*module.exports.deposit_get= (req,res) =>{  
     
}
*/
/*module.exports.dashboard_get= (req,res) =>{
     const token = req.cookies.jwt;
    const user =  jwt.verify(token,'Tradexcellent')
    const email = user.email;

      User.findOne({email}).populate('deposit_id')
      .then(data =>{
           console.log(data);
           res.render('dashboard',{user:email,data:data})
      })
      .catch(err=>{
           console.log(err);
      })

     
}
*/
module.exports.deposit_post= (req,res) =>{
     const deposit = new Deposit();
     deposit.type = req.body.type;
     deposit.package = req.body.package;
     deposit.amount = req.body.amount;
     deposit.username= req.body.username;
     deposit.save()
       .then((result) => {
         User.findOne({username:deposit.username}, (err, user) => {
             if (user) {
                 // The below two lines will add the newly saved review's 
                 // ObjectID to the the User's reviews array field
                 user.deposit_id= deposit;
                 user.save();
                 res.status(200).json({user:user.email})
             }
         });
       })
       .catch((error) => {
         res.status(500).json({ error });
       });
 };


/*module.exports.checkpayment_get= (req,res) =>{
     res.render('check_payment')
}
*/
module.exports.bonus_get= (req,res) =>{
     res.render('bonus')
}
module.exports.withdraw_get= (req,res) =>{
     const token = req.cookies.jwt;
     const user =  jwt.verify(token,'Tradexcellent')
     const email = user.email;
  
     User.find({email},function(err,data){
     console.log(data);
     data.forEach(function(obj) {
      res.render('withdraw',{user:obj.username})
      })
   }) 
}
module.exports.withdraw_post= (req,res) =>{
     res.render('withdraw')
}
module.exports.referals_get= (req,res) =>{
     res.render('referals')
}
module.exports.home = (req,res) =>{
     res.render('homepage');
}
module.exports.logout_get =(req,res) =>{
     res.cookie('jwt','',{maxAge:1});
     res.redirect('/');
}