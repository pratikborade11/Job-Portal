import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from '../models/jobSchema.js'

export const getAllJobs = catchAsyncError(async(req,res,next)=>{
    const jobs = await Job.find({expired : false}); //fetches only those jobs which are not expired yet 
    res.status(200).json({
        success : true,
        jobs,
    });
});

//Post a new Job
export const postJob = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    //const role = req.user.role;
    if(role === "Job Seeker"){
        return next (new ErrorHandler("Job seeker is restriced from this access!",400 ));
    }
    const {title ,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo } = req.body;

    //Error Handling
    if(!title || !description || !category || !country || !city || !location){
        return next(new ErrorHandler("Please Provide full job details!", 400));
    }
    if((!salaryFrom || !salaryTo) && !fixedSalary){
        return next(new ErrorHandler("Please either provide fixed salary or ranged salary!", 400));

    }
    if(!salaryFrom && !salaryTo && !fixedSalary){
        return next(new ErrorHandler("Cannot enter fixed salary and ranged salary together!", 400));

    }
    const postedBy = req.user._id; //id of employer who posted job
    const job = await Job.create({ title ,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo , postedBy}); //store info of posted job in the database

    res.status(200).json({
        success : true,
        message : "Job Posted Successfully!",
        job
    })


});

//To give employer access to see posted job which are only posted by him
export const getMyJobs  = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next (new ErrorHandler("Job seeker is restriced from this access!",400 ));
    }
    const myjobs = await Job.find({postedBy : req.user._id});
    res.status(200).json({
        success : true,
        myjobs,
    });
});

//Update Previously Job 
export const updateJob = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next (new ErrorHandler("Job seeker is restriced from this access!",400 ));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next (new ErrorHandler("Sorry , Job not found!",400 ));

    }
    job = await Job.findByIdAndUpdate(id,req.body,{
        new : true,
        runValidators : true,
        useFindAndModify : false
    })
    res.status(200).json({
        success : true,
        job,
        message : "Job Updated Successfully",
    })
});

//Delete a Job
export const deleteMyJob  = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next (new ErrorHandler("Job seeker is restriced from this access!",400 ));
    }
    const {id} = req.params;
    let job = await Job.findById(id);
    if(!job){
        return next (new ErrorHandler("Sorry , Job not found!",400 ));

    }
    await job.deleteOne();

    res.status(200).json({
        success : true,
        message : "Job Deleted Successfully!",
    })
});

export const getSingleJob = catchAsyncError(async(req,res,next)=>{
    const {id} = req.params;
    try{
        const job = await Job.findById(id);
        if(!job){
            return next(new ErrorHandler("Job Not Found",404));
        }
        res.status(200).json({
            success:true,
            job
        })
    } catch(error){
        return next(new ErrorHandler("Invalid Job Id",400));
    }
})