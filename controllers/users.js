const User = require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
}


module.exports.signup= async(req,res)=>{
    //i want ki error par wapas signup page par chala jaun isliye try catch use kiya 
    try{
    let {username, email , password}= req.body;
    const newUser=new User({email,username});
    const registerUser = await User.register(newUser,password);
    // console.log(registerUser);

    //user sign up hote hi we want ki login bhi ho jaye explicitly dubara login naa karna pade
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }   
        req.flash("success","Welcome to Wanderlust !! ");
        res.redirect("/listings");
    })

    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async (req,res)=>{ 
    req.flash("success","welcome to wanderlust you are logged in");
    // res.redirect("/listings");
    // res.redirect(req.session.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";  //if redirect url exist karta h toh us par redirect kara do and 
                                                              //also possible ki hamne direct login par gye then /listings par jao
    // res.redirect(res.locals.redirectUrl);
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logout !!");
        res.redirect("/listings");
    });
}