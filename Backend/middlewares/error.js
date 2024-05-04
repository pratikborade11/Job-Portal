//For Error handling purpose

class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message),
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    if(err.name === "CaseError"){
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    //to avoid duplicate email entry while doing login or registration
    if(err.name === "11009"){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid , Try again`;
        err = new ErrorHandler(message,400);
    }

    if(err.name === "TokenExpireError"){
        const message = `Json Web token is expired, Try again!`;
        err = new ErrorHandler(message,400);
    }
    return res.status(err.statusCode).json({
        success: false,
        message : err.message,
    });
};

export default ErrorHandler;
