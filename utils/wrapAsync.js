// function wrapasync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch(next);
//     }
// }

//upar wala bhi same hi hai 
module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}