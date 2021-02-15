require('dotenv').config()
const express = require('express');
const ejs =require('ejs')
const bodyPraser= require('express');
const mongoose = require('mongoose');
// require the express session  passport and the passport-local-mongoose
const session = require('express-session');
const passport= require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const app = express();
const PORT =3000;
// use the body parse
app.use(bodyPraser.urlencoded({extended:true}))
// set ejs 
app.set('view engine', 'ejs');
// static content
app.use(express.static('public'));

// use the session or create the session object
app.use(session({
    secret: 'our node secret',
    resave: false,
    saveUninitialized: false
  }))

// initialize the passport
app.use(passport.initialize()); 
//tell passport to use the session object
app.use(passport.session());


// mongoose setup

const url = 'mongodb+srv://rprashar:36DLQie7Z1YYnzPH@cluster0.q7vuq.mongodb.net/UserDB?retryWrites=true&w=majority';
mongoose.connect(url);
mongoose.set("useCreateIndex",true)


// userSchema UserModel and Real Object
const userSchema = new mongoose.Schema({
    username:String,
    password:String
})

// use passport-local-mongoose plugin 
userSchema.plugin(passportLocalMongoose);

// created the usermodel
const User = new mongoose.model('User',userSchema);
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


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

app.get("/secrets",function(req,res){
    if(req.isAuthenticated())
    {
        res.render("secrets")
    }
    else{
        res.redirect("/login")
    }
})

app.post("/register",function(req,res){
    
        
    User.register({username:req.body.username}, req.body.password, function(err, user) {
       if(err)
       {
           console.log("error occurred"+err)
           res.redirect("/register")
       } else{
           console.log("success")
           passport.authenticate("local")(req,res,function(){
           res.redirect("/secrets")
           })
       }
   })
})

app.post("/login",function(req,res){
    // again passport will check wehther this user has an account or not
    const user =new User({
        username:req.body.username,
        password:req.body.password
    })

    // Passport exposes a login fucntion on req to establish a login session
    req.login(user,function(err){
     if(err)
     {
         console.log('user has not registered with us ')
         res.redirect("/register")
     }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets")
            })
     }
    })
})

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
app.listen(PORT,function(){
    console.log('The App is running on PORT '+PORT)
})




