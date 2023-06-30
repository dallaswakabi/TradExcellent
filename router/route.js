const  {Router}= require('express');
const controller = require('../controller/controller')
const {requireAuth} = require('../authmiddleware/middleware');
//const services =  require('../services/render');

const route= Router();

 route.get('/register',controller.register_get)
 route.post('/register',controller.register_post)
 route.get('/login',controller.login_get)
 route.post('/login',controller.login_post) 
 //route.get('/dashboard',requireAuth,controller.dashboard_get);
 route.get('/bonus',controller.bonus_get)
 //route.get('/deposit',controller.deposit_get)
 route.post('/deposit',controller.deposit_post)
 //route.get('/check_payment',requireAuth,controller.checkpayment_get)
 route.get('/withdraw',controller.withdraw_get)
 route.post('/withdraw',controller.withdraw_post)
 //route.get('/wallet/:id',controller.update);
 route.get('/referals',controller.referals_get)
 route.get('/logout',controller.logout_get);
 route.get('/',controller.home);



// api
//route.put('/api/users/:id',controller.update);
 module.exports = route;