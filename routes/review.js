const express=require("express");
const router=express.Router({mergeParams:true}); //mergeparams -> ye id ko bhi le ayega app.js se (parent route se -> child ko bhi laakar dega parameters used in routes)

const Listing =require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema , reviewSchema}=require("../schema.js");
const Review =require("../models/review.js");

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    // console.log(result);
    if(error){   // if  error aaya hai
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

//post route
router.post("/",validateReview,wrapAsync(async(req,res)=>{ // '/' is child routes
    let listing =await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("new review saved");
     req.flash("success","New review created !!");
    res.redirect(`/listings/${listing.id}`)
}));
//delete route
router.delete("/:reviewId",wrapAsync(async(req,res) =>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     req.flash("success"," review deleted !!");
    res.redirect(`/listings/${id}`)
}));

module.exports=router;