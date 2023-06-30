const mongoose = require('mongoose');
const dburl ='mongodb+srv://snowlin:snowlin@cluster0.ubf4d.mongodb.net/tradexcellent1?retryWrites=true&w=majority'

const connectDB = async () =>{
    try{
         const con = await mongoose.connect(dburl,{useNewUrlParser:true},{useUinifiedTopology:true},{useFindAndModify:false}
            ,{useCreateIndex:true})
            console.log('database connected');
    }
    catch(err){
      console.log(err);
      process.exit(1);
    }
}

module.exports = connectDB;