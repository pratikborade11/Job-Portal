import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


//User Registration
export const register = catchAsyncError(async(req,res,next)=>{
    const {name , email , phone , role , password} = req.body;
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("Please Enter all fields!!"));
    }

    const isEmail = await User.findOne({ email });//for checking email is already registered
    if (isEmail){
        return next(new ErrorHandler("Email already Exists!!"));
    }
    const user = await User.create({
        name,email,phone,role,password,
    });

   sendToken(user, 200 , res , "User Registered Successfully");
});

//User Login
export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password,role} = req.body;

    if(!email || !password || !role){
        return next(new ErrorHandler("Please Provide email, password and role", 400))
    }
    const user = await User.findOne( { email }).select("+password");
    if(!User){
      return next(
        new ErrorHandler("Invalid Email or Password",400)
      );

    }
    const isPasswordMatched = await user.ComparePassword(password);
    if(!isPasswordMatched){
      return next (new ErrorHandler("Invalid Email or Password",400));
    }

    if(user.role !== role){
      return  next(new ErrorHandler("User with this role not found!",400));
    }
    sendToken(user, 200 , res , "User Logged in Successfully");
});

//User Logout
export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        httpOnly : true,
        expires : new Date(Date.now()),
    }).json({
        success : true,
        message : "User Logged Out successfully",

    });
});

export const getUser = catchAsyncError(async(req,res,next)=>{
   const user = req.user;
   res.status(200).json({
    sucess : true,
    user,
   })
});