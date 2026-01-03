//using  express router taaki app.js bulky and large naa bane har ek part ki new js file bana li
const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js"); //path should also be acc to listing.js
// const {listingSchema , reviewSchema}=require("../schema.js");
// const ExpressError=require("../utils/ExpressError.js");
const Listing =require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");

const listingController= require("../controllers/listings.js");



// //index route
// router.get("/",wrapAsync(async (req,res)=>{
//    const allListings= await Listing.find({});
//    res.render("listings/index.ejs",{allListings});
// }));

// .............using mvc standard
//index route
router.get("/",wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show rooute
router.get("/:id",wrapAsync(listingController.showListing));

//create route
router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports= router;