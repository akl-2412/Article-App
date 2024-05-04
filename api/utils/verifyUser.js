import jwt from 'jsonwebtoken';
import {errorHandler} from './error.js';


export const verifyToken = (req,res,next)=>{
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'Unauthorized'));
        }
        req.user=user;
        next();
    });
}

//isStudent
export const isStudent = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Student"){        //we had saved accountType in payload in controller(in login when password is checking) and when we decode token in auth to verify the token
               return res.status(401).json({              // and we done req.user = decode; So accountType is also saved in user 
                   success:false,
                   message:'This is a protected route for Students only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}

//isInstructor
export const isInstrucor = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }

//isAdmin

export const isAdmin = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
}  