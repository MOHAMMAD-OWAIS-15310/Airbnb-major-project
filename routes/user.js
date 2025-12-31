const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");

router.get("/signup",(req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res)=>{
    //i want ki error par wapas signup page par chala jaun isliye try catch use kiya 
    try{
    let {username, email , password}= req.body;
    const newUser=new User({email,username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.flash("success","Welcome to Wanderlust !! ");
    res.redirect("/listings");
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",passport.authenticate('local',{failureRedirect : '/login', failureFlash : true}),// authenticate nhi hua toh login par hi redirect kar jaayega
async (req,res)=>{ 
    req.flash("success","welcome to wanderlust you are logged in");
    res.redirect("/listings");
});

module.exports=router;