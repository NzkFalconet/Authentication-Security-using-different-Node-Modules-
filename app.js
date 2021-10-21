//jshint esversion:6
require('dotenv').config()
var md5 = require('md5');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const cookie_secret="Our Little Secret";

app.use(session({
  secret: cookie_secret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/accountDB", {useNewUrlParser: true});

const accountSchema =new mongoose.Schema({
  email:String,
  password: String
});

accountSchema.plugin(passportLocalMongoose);

// accountSchema.plugin(encrypt,{secret:secret},encryptedFields:['password']);

// accountSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields: ["password"]});

const Account = mongoose.model("Account", accountSchema);

passport.use(Account.createStrategy());

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

 



///////////////////////////////////Requests Targetting all Routes////////////////////////

app.get('/',(req,res)=>{
    res.render('Home');

});

app.get('/login',(req,res)=>{
    res.render('login');

});

app.post('/login',(req,res)=>{
   const account = new Account({
     username:req.body.username,
     password:req.body.password
   })
   
   req.login(account,(err)=>{
     if(err)
     {
       console.log(err);
     }
     else
     {
       passport.authenticate("local")(req,res,()=>{
         res.redirect('/secrets');
       });
     }
   })
})

app.get('/register',(req,res)=>{
    res.render('register');
})


app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/login');
})

app.get('/secrets',(req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets");
  }
  else
  {
    res.redirect('/login');
  }
});

app.post('/register',(req,res)=>{

  Account.register({username:req.body.username},req.body.password,(err,user)=>{
    if(err)
    {
      console.log(err);
      res.redirect('/register');
    } else
    {
      passport.authenticate("local")(req,res,()=>{
        res.redirect('/secrets');
      })
    }

  })
   
});
    
   
  
    






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
