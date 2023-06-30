const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} =  require('validator'); 
const user = new mongoose.Schema({
    firstname:{
        type:String,
        required:[true, 'please enter firstname'],
        unique:true,
        lowecase:true
    },
    lastname:{
        type:String,
        require:[true, 'please enter lastname'],
        unique:true,
        lowecase:true
    },
    username:{
        type:String,
        required:[true, 'please enter username'],
        unique:true,
        lowecase:true
    },
    email:{
        type:String,
        required:[true, 'please enter email'],
        unique:true,
        lowecase:true,
        validate:[isEmail, 'please enter valid email']
  
    },
    
    password:{
        type:String,
        required:[true, 'please enter an password'],
        unique:true,
        minlenght:[6,'please minimum password length is 6 character']
    },
    deposit_id: { type: mongoose.Schema.Types.ObjectId, ref: "deposit" },
    wallet:{type:mongoose.Schema.Types.ObjectId,ref:"wallet"}
}, {
  toJSON: {
    virtuals: true,
  },
  });
     
   // static method to login
     user.statics.login = async function(email,password){
         const user = await this.findOne({email});
         if(user){
             const auth = await bcrypt.compare(password,user.password);
             if(auth){
                 return user;
             }
             throw Error('incorrect password');
             
         }
         throw Error('incorrect email');
     }
  const User = mongoose.model('user',user);
  module.exports = User