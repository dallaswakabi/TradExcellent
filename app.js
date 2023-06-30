const express = require('express');
const mongoose = require ('mongoose');
const authroute = require('./router/route')
const cookieparser = require('cookie-parser');
//const bodyparser = require("body-parser");
const morgan= require('morgan');
//const services = require('./services/render');
const controller = require('./controller/controller')
const app = express();
const {requireAuth} = require('./authmiddleware/middleware');
const User = require('./models/User');
const wallets = require('./models/wallet');
const  axios = require('axios');
const jwt = require('jsonwebtoken');
const  bcrypt= require('bcrypt');
const path = require('path');
const dotenv = require('dotenv');
const PORT =process.env.PORT || 3000
//const  {Router}= require('express');
// middleware
app.use(express.static('public'));
app.use(morgan('tiny'))
app.use(express.json());
app.use(cookieparser());
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))
dotenv.config();
//app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
// view engine
app.set('view engine','ejs');
//app.use(express.methodOveride() );

// database connection

app.listen(PORT || 3000,async()=>{
       try {
        const dbconnect = await mongoose.connect(process.env.DATABASE,
        {useNewUrlParser:true},
        { useUnifiedTopology: true },
        {useFindAndModify:false},
        {useCreateIndex:true}
        )
          if(dbconnect){
            console.log(`Database Connected Successfully!`);
            console.log(`Server Is Listening On Port ${PORT}`);
          }else{
            console.log(`Database Failed Connect !`);
          }
       } catch (error) {
        console.log(error)
       }
})
 // route
 
//routing.get('/api/users',controller.find);





app.get('/admin',requireAuth,(req,res)=>{
       User.find({},function(err,data){
              console.log(data);
              
              res.render('../admin/admin.ejs',{users:data});
       })
    
})

// static withdraw 
   
     app.get('/with1',requireAuth,(req,res)=>{
      const token = req.cookies.jwt;
      const user =  jwt.verify(token,'Tradexcellent')
      const email = user.email;
   
      User.find({email},function(err,data){
      console.log(data);
      data.forEach(function(obj) {
       res.render('with1',{user:obj.username});
       })
    })

})

//app.get('/wallet/:id',controller.update)
app.get('/admin/delete/:id',requireAuth,function(req, res){
       var id = req.params.id;
       User.findByIdAndDelete(id)
       .then(result=>{
           res.redirect('/admin');
       })
       .catch(err=>{
          console.log(err); 
       })
})
app.get('/add-user',requireAuth,(req,res)=>{
       res.render('../admin/add-user.ejs');
   })
app.get('/user1',requireAuth,(req,res)=>{
       const token = req.cookies.jwt;
       const user =  jwt.verify(token,)
       const email = user.email;
    
       User.find({email},function(err,data){
       console.log(data);
       data.forEach(function(obj) {
              res.render('user1',{user:obj.username});
        })
     })
   })
app.get('/user2',requireAuth,(req,res)=>{
       const token = req.cookies.jwt;
       const user =  jwt.verify(token,process.env.TOKEN_SECRET)
       const email = user.email;
    
       User.find({email},function(err,data){
       console.log(data);
       data.forEach(function(obj) {
              res.render('user2',{user:obj.username});
        })
     })     
   })
app.get('/user3',requireAuth,(req,res)=>{
       const token = req.cookies.jwt;
       const user =  jwt.verify(token,process.env.TOKEN_SECRET)
       const email = user.email;
    
       User.find({email},function(err,data){
       console.log(data);
       data.forEach(function(obj) {
              res.render('user3',{user:obj.username});
        })
     }) 
   })
app.post('/add-user',requireAuth,async(req,res)=>{
       const {firstname,lastname,username,email}= req.body;
       const salt = await bcrypt.genSalt(10);
       const password =  await bcrypt.hash(req.body.password,salt);
             
             
       try{
       const user = await User.create({firstname,lastname,username,email,password});
       res.status(201).json({user:user.email});
       }
       catch(err){
            const errors= handleErrors(err);
            res.status(400).json({errors});
       }
})
app.post('/wallet',requireAuth,async(req,res)=>{
       const {wallet}=req.body;
       try{
              const user = await wallets.create({wallet})
              res.status(201).json({user:user._id});
       }
       catch(err){
              const errors= handleErrors(err);
              res.status(400).json({errors});
         }
})
app.get('/wallet',requireAuth,(req,res)=>{
       wallets.find({},function(err,data){
              console.log(data);
              
              res.render('../admin/wallet.ejs',{users:data});
       })
    
})
//app.put("/wallet/update/:id/update",controller.update)
/*app.post('/wallet',async(req,res)=>{
    const {wallet} = req.body;
    try{
       const user = await wallets.create({wallet});
       res.status(201).json({user:user._id});
    }
    catch(err){
           const errors = handleErrors(err);
           res.status(400).json({errors});
    }
})
*/

app.get('/view',requireAuth,(req,res)=>{
       User.find({},function(err,data){
              console.log(data);
              res.render('../admin/view.ejs',{users:data})
              
       })
      
   })
   app.get('/depo1',requireAuth,(req,res)=>{
       const token = req.cookies.jwt;
       const user =  jwt.verify(token,process.env.TOKEN_SECRET)
       const email = user.email;
   
       wallets.find({},function(err,doc){
         User.find({email},function(err,data){
         console.log(data);
          data.forEach(function(obj) {
          res.render('depo1',{user:obj.username,users:doc})
         })
       })
        
       })
   })
 app.get('/deposit',requireAuth,(req,res)=>{
       const token = req.cookies.jwt;
    const user =  jwt.verify(token,process.env.TOKEN_SECRET)
    const email = user.email;

    wallets.find({},function(err,doc){
      User.find({email},function(err,data){
      console.log(data);
       data.forEach(function(obj) {
       res.render('deposit',{user:obj.username,users:doc})
      })
    })
     
    })
 })
app.get('/dashboard',requireAuth,(req,res)=>{
       const token = req.cookies.jwt;
      const user =  jwt.verify(token,process.env.TOKEN_SECRET)
      const email = user.email;
   
      User.find({email},function(err,data){
      console.log(data);
      data.forEach(function(obj) {
       res.render('dashboard',{user:obj.username});
       })
    }) 
            
})
app.use(authroute);
app.get('/404',requireAuth,(req,res)=>{
       res.render('404');
})
