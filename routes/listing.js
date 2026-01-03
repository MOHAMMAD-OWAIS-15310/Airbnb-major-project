//using  express router taaki app.js bulky and large naa bane har ek part ki new js file bana li
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js"); //path should also be acc to listing.js
// const {listingSchema , reviewSchema}=require("../schema.js");
// const ExpressError=require("../utils/ExpressError.js");
const Listing =require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");



//index route
router.get("/",wrapAsync(async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}))

//new route
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);

    //............. we want ki ye edit delete sabme authenticate ho so we will create middleware
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in to create listing !");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
})

//show rooute
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate({path : "reviews",populate : { path:"author" },}).populate("owner");//we want har review k sath uska author bhi  aaye
    if(!listing){
       req.flash("error"," listing u requested for does not exist !!");
       res.redirect("/listings"); 
    }
    else{
        // console.log(listing);
        res.render("listings/show.ejs",{listing});
    }
}));

//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{  //used wrap async so remove try catch   //first valdidate listing will be called
        // if(!req.body.listing){  //server side validation
        //     throw new ExpressError(404,"title missing");
        // }

        // let result=listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){   // if result have error
        //     throw new ExpressError(400,result.error);
        // }

        // let {title,description ,image,price, country, location}=req.body;
        // let listing = req.body.listing;
        const newListing= new Listing(req.body.listing);
        // console.log(req.user);
        newListing.owner=req.user._id; //new listing me current user ki id store ho
        await newListing.save();
        req.flash("success","New listing created !!");//flash ek baar aate hai refresh ke baad fir nhi aate
        res.redirect("/listings");

    
}));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
       req.flash("error"," listing u requested for does not exist !!");
       res.redirect("/listings"); 
    }
    else{

        res.render("listings/edit.ejs",{listing});
    }
}));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // let listing = await Listing.findById(id);
    //sabme ye condition lagao its better to create middleware
    // if( !listing.owner.equals(res.locals.currUser._id)){ //now we can remove hiding edit and delete btns
    //     req.flash("error"," you are not the owner of this listing !!");
    //     return res.redirect(`/listings/${id}`);
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash("success"," listing updated !!");
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success"," listing deleted !!");
    res.redirect("/listings");
}));

module.exports= router;