//jshint esversion:6
require('dotenv').config()
var md5 = require('md5');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const bcrypt= require('bcrypt');
const saltRounds = 12;


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/accountDB", {useNewUrlParser: true});

const accountSchema =new mongoose.Schema({
  email:String,
  password: String
});


// accountSchema.plugin(encrypt,{secret:secret},encryptedFields:['password']);

// accountSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields: ["password"]});

const Account = mongoose.model("Account", accountSchema);

///////////////////////////////////Requests Targetting all Articles////////////////////////

app.get('/',(req,res)=>{
    res.render('Home');

});

app.get('/login',(req,res)=>{
    res.render('login');

});

app.post('/login',(req,res)=>{
    Account.findOne({email:req.body.username},(err,foundAccount)=>{
        if(err)
        {
           console.log(err);
         
        }
        else
        {
           if(foundAccount)
           {
            bcrypt.compare(req.body.password, foundAccount.password, function(err, result) {
               if(result===true)
               {
                   res.render('secrets');
               }
            });
               
           }
            
        }
        
    })

})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
              if(req.body.username==""|| req.body.password=="")
             {
                    res.redirect("/register");
             }

               else
             {
                 const account= new Account({
                email:req.body.username,
                password:hash
              })
                 console.log("Account has been created. You are now logged in!");
                 account.save();
                 res.render('secrets');
            
             } 
                  
                
            })
        
    });
    
   
  
    






app.listen(3000, function() {
  console.log("Server started on port 3000");
});
