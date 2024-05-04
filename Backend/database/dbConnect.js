import mongoose from  'mongoose';

//databse connectivity (mongodb)
export const dbConnect = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName : "JOB_PORTAL",
    }).then(()=>{
        console.log("Connected to database successfully!")
    }).catch((err)=>{
        console.log(`db Connectivity error",${err}`)
    });
};

