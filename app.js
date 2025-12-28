const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}=require("./schema.js");
const Review =require("./models/review.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("connected to db")
    })
    .catch((err)=>{
        console.log(err);
    });

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("api working");
})


//validate listing using middleware ,we can also do like i did in create route
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    // console.log(result);
    if(error){   // if  error aaya hai
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}
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

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
   const allListings= await Listing.find({});
   res.render("listings/index.ejs",{allListings});
}))

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//show rooute
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//create route
app.post("/listings",validateListing,wrapAsync(async (req,res,next)=>{  //used wrap async so remove try catch   //first valdidate listing will be called
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
        await newListing.save();
        res.redirect("/listings");

    
}));

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//reviews
//post route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // res.send("new review saved");
    res.redirect(`/listings/${listing.id}`)
}));
//delete route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res) =>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))


// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title: "my new villa",
//         discription: "by the beach",
//         price: 5400,
//         location:"amroha , UP",
//         country :"india"
//     })
//     await sampleListing.save();
//     console.log("sample is saved");
//     res.send("successful");
// })

app.use((req,res,next)=>{ //any path not found
    next(new ExpressError(404,"Page Not Found"));
});

//middleware (studied earlier)
app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    // res.send("something went Wrong !!");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});

