const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);

    //............. we want ki ye edit delete sabme authenticate ho so we will create middleware
    // if(!req.isAuthenticated()){
    //     req.flash("error","you must be logged in to create listing !");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
}

module.exports.showListing=async (req,res)=>{
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
}

module.exports.createListing =async (req,res,next)=>{  //used wrap async so remove try catch   //first valdidate listing will be called
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

        let url= req.file.path;
        let filename =  req.file.filename;
        console.log(url,"..",filename);
        const newListing= new Listing(req.body.listing);
        // console.log(req.user);
        newListing.owner=req.user._id; //new listing me current user ki id store ho
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New listing created !!");//flash ek baar aate hai refresh ke baad fir nhi aate
        res.redirect("/listings");
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
       req.flash("error"," listing u requested for does not exist !!");
       res.redirect("/listings"); 
    }
    else{
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300,w_250");
        res.render("listings/edit.ejs",{listing,originalImageUrl});
    }
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    // let listing = await Listing.findById(id);
    //sabme ye condition lagao its better to create middleware
    // if( !listing.owner.equals(res.locals.currUser._id)){ //now we can remove hiding edit and delete btns
    //     req.flash("error"," you are not the owner of this listing !!");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url= req.file.path;
        let filename =  req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
     req.flash("success"," listing updated !!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success"," listing deleted !!");
    res.redirect("/listings");
}