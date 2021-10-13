//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const encrypt= require('mongoose-encryption');


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

accountSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields: ["password"]});

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
               if(foundAccount.password==req.body.password)
               {
                //    console.log(foundAccount.password);
                   console.log("account Matched. Now you are going to Secret Page!");
                    res.render('secrets');
               }
               else
               {
                console.log("account doesn't Match. Please Login Again!");
                res.render('login');
               }
           }
            
        }
        
    })

})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',(req,res)=>{

    if(req.body.username==""|| req.body.password=="")
    {
         res.redirect("/register");
    }
    else 
    {
      
        Account.findOne({email:req.body.username},(err,foundAccount)=>{
            if(foundAccount)
            {
                console.log("This Account is already exists. Please log in ");
                
                res.redirect('/login');
             
            }
            else
            {
                const account= new Account({
                    email:req.body.username,
                    password:req.body.password
                })
                console.log("Account has been created. Please login Now!");
                account.save();
                res.redirect('/login');
                
            }
        })
    }
  
    
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
