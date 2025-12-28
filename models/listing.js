const mongoose=require("mongoose");
const Schema=mongoose.Schema;

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
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports= Listing;