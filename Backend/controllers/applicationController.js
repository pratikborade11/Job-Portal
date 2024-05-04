import { catchAsyncError } from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobSchema.js";

//Employer can see applications recieved
export const employerGelAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Job Seeker"){
        return next (new ErrorHandler("Job seeker is restriced from this access!",400 ));
    }
    const {_id} = req.user;
    const applications = await Application.find({'employerId.user' : _id});

    res.status(200).json({
        success : true,
        applications
    })
});

export const jobseekerGelAllApplications = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next (new ErrorHandler("Employer is restriced from this access!",400 ));
    }
    const {_id} = req.user;
    const applications = await Application.find({'applicantId.user' : _id});

    res.status(200).json({
        success : true,
        applications
    })
});

//Job seeker can delete its application 
export const jobseekerDeleteApplication = catchAsyncError(async(req,res,next)=>{
    const {role} = req.user;
    if(role === "Employer"){
        return next (new ErrorHandler("Employer is restriced from this access!",400 ));
    }

    const {id} = req.params;
    const application = await Application.findById(id);

    if(!application){
        return next(new ErrorHandler("Oops , Application not found!",404));

    }
    await application.deleteOne();

    res.status(200).json({
        success : true,
        message : "Application Deleted Successfully"
    })
});

//Post application by the Job Seeker
export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler("Employer not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Resume File Required!", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantId = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("Job not found!", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found!", 404));
  }

  const employerId = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantId ||
    !employerId ||
    !resume
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantId,
    employerId,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});



export const applicationStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  // Simple validation
  if (!status) {
      return res.status(400).json({ message: "Status is required" });
  }

  try {
      // Find the application by ID and update its status
      const updatedApplication = await Application.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedApplication) {
          return res.status(404).json({ message: "Application not found" });
      }

      res.json(updatedApplication);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};
