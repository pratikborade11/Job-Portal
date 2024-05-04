import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    title : {
        type : String,
        required : [true,"Pleace enter Job Title"],
        minLength : [3 , "Job Title must contain 3 characters"],
        maxLength : [50 , "Job Title cannot exceed 50 characters"],

    },
    description : {
        type : String,
        required : [true,"Pleace enter Job Description"],
        minLength : [30 , "Job description must contain 30 characters"],
        maxLength : [350 , "Job description cannot exceed 350 characters"],
    },
    category : {
        type : String,
        required : [true,"Pleace enter Job Category"],
        
    },
    country : {
        type : String,
        required : [true,"Pleace enter Job Country"],

    },
    city : {
        type : String,
        required : [true,"Pleace enter Job City"],
    },
    location : {
        type : String,
        required : [true,"Pleace provide exact location"],
        minLength : [30 , "Job location must contain atleast 30 characters"]
    },
    fixedSalary : {
        type : Number,
        minLength : [4,"Fixed Salary Must contain at least 4 digits"],
    },
    salaryFrom : {
        type : Number,
        minLength : [4," Salary from Must contain at least 4 digits"],

    },
    salaryTo :{
        type : Number,
        minLength : [4," Salary from Must contain at least 4 digits"],
    },
    expired :{
        type : Boolean,
        default:false,
    },
    jobPostedOn : {
        type : Date,
        default : Date.now,
    },
    postedBy : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,
    },

})


export const Job = new mongoose.model("Job",jobSchema);