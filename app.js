require('dotenv').config()
const express = require('express');
const app = express();
const PORT =3000;
const bodyPraser= require('express');
// use the body parse
app.use(bodyPraser.urlencoded({extended:true}))

// ejs 
app.set('view engine', 'ejs');

// static content
app.use(express.static('public'))

// mongoose setup
const mongoose = require('mongoose')
const url = 'mongodb+srv://rprashar:36DLQie7Z1YYnzPH@cluster0.q7vuq.mongodb.net/UserDB?retryWrites=true&w=majority';
mongoose.connect(url);

// mongoose encryption
var encrypt = require('mongoose-encryption');

// userSchema UserModel and Real Object
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true}
})
// mongoose encryption 

userSchema.plugin(encrypt, { secret: process.env.secretKey, encryptedFields: ['password'] });

const UserModel = mongoose.model('User',userSchema);

// the incoming requests

app.get("/",function(req,res){
    res.render('home')
})

app.get("/login",function(req,res){
    res.render('login')
})

app.get("/register",function(req,res){
    res.render('register')
})

app.post("/register",function(req,res){

    const user = new UserModel(
        {
            name:req.body.username,
            password:req.body.password
        }
    )
    user.save(function(err){
        if(!err){
            res.render("secrets")  
        }
        else{
            console.log("some error occuredd while registering the user")
        }
    });
})


app.post("/login",function(req,res){
    // check whether the credentials are correct if not ask him to registerand then come
    const userName=req.body.username;
    const password=req.body.password;


    UserModel.findOne({name:userName},function(err,foundUser){
        if(!err)
          {
              if(foundUser)
              {
                  if(foundUser.password===password)
                  {
                      console.log(" password is "+foundUser.password )
                    console.log(" user found")
                    res.render("secrets")
                  }
                 
              }
              else{
                console.log(" user not found")
                  res.render("register")
              }
          }
          else{
              res.redirect("/")
          }
    })
})

app.listen(PORT,function(){
    console.log('The App is running on PORT '+PORT)
})




