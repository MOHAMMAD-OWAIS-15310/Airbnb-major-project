const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const review = require("./review.js");

const listingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description: String,
    image:{
        type:String,
        default: "https://i.ytimg.com/vi/HmFCMCQWbFo/maxresdefault.jpg" ,
        set : (v)=> v==="" ? "https://i.ytimg.com/vi/HmFCMCQWbFo/maxresdefault.jpg" :v,
    },
    price: Number,
    location : String,
    country : String,
    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});

//mongoose middleware => hamne listing delete kari then uske saare reviews bhi delete ho jaye
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listingSchema.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;