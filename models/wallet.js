const mongoose = require('mongoose');

const wallet = new mongoose.Schema({
     wallet:{
         type:String
     }
})

const wallets = mongoose.model('wallet',wallet);
module.exports = wallets