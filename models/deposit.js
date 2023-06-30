 const mongoose = require('mongoose');

  const depositschema = new mongoose.Schema({
        type:{
                type:String,
                require:true
                },
        username:{
                 type:String,
                 required:[true, 'please enter username'],
                 lowecase:true
        },
        package:{
                 type:String,
                 required:true
                },
         user_id: [{
                  type: mongoose.Schema.Types.ObjectId, 
                  ref: "user" }
                ],
        amount:{
                type:Number,
                required:true
                },
        date: { type: Date, default: Date.now },
                      });
  
const Deposit = mongoose.model('deposit',depositschema);
  module.exports = Deposit