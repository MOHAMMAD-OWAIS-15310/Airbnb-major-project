const mongoose= require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

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

const initDB=async ()=>{      //initDB is a function
    await Listing.deleteMany({});
    //adding owner prop to db directly data.js me har ek object m owner : idofowner(from users collection) kar sakte but this is better way
    initData.data = initData.data.map((obj)=>({...obj,owner: "6953f02db9cd341705d8ab26"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();