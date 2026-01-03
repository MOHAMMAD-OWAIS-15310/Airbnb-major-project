const Listing=require("./models/listing");
const {listingSchema , reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review");

module.exports.isLoggedIn =(req,res,next)=>{
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        //redirect url save (jis page se login page aaya ,login k baad wahi jaana chahte hai)
        req.session.redirectUrl=req.originalUrl ;
        req.flash("error","you must be logged in !");
        return res.redirect("/login");
    };
    next(); 
};

module.exports.saveRedirectUrl= (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    // sabme ye condition lagao its better to create middleware
    if( !listing.owner.equals(res.locals.currUser._id)){ 
        req.flash("error"," you are not the owner of this listing !!");
        return res.redirect(`/listings/${id}`);
    }
    next(); //i generally forget to call next
};

//ye dono listing and review vali mw ko ham inke files m yaha laaye hai bc files badi ho rhi thi

//validate listing using middleware ,we can also do like i did in create route
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(result);
    if(error){   // if  error aaya hai
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    // console.log(result);
    if(error){   // if  error aaya hai
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor =async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review = await Review.findById(reviewId);
    // sabme ye condition lagao its better to create middleware
    if( !review.author.equals(res.locals.currUser._id)){ 
        req.flash("error"," you are not the author of this review !!");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};