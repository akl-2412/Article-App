
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {mailSender} from '../utils/mailSender.js';

export const signup = async (req,res,next)=>{
    try{
        const {username,email,password,accountType} = req.body;

        if(!username || !email || !password || username==='' || email==='' || password===''){
            next(errorHandler(400,'All fields are required'));
        }
        const check=await User.findOne({username:username});
        console.log(check);
        const check2=await User.findOne({email:email});
        if(check){
          return res.status(400).json({                             //return response
            success:false,
            message:'Username already found',
          });
        }
        if(check2){
          return res.status(400).json({                             //return response
            success:false,
            message:'Invalid Email',
          });
        }
        const hashedPassword=bcryptjs.hashSync(password,10);
        const newUser = new User({
            username,
            email,
            password:hashedPassword,
            accountType:accountType,
        });
        await newUser.save();
        res.status(200).json({message:"Signup successfull"});
    }
    catch(error){
        next(error);
    }
}

export const signin = async(req,res,next)=>{
    const {email,password}= req.body;
    if(!email|| !password || email==='' || email== ''){
        next(errorHandler(400,'All fields are required'));
    }
    try{
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return next(errorHandler(400,'Invalid Password'));
        }
        const token = jwt.sign(
            {id:validUser._id,accountType:validUser.accountType},process.env.JWT_SECRET
        )
        const {password : pass,...rest} = validUser._doc;
        res.status(200).cookie('access_token',token,{
            httpOnly:true,
        })
        .json(rest);


    }
    catch(error){
        return next(error);
    }
}


export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl,accountType } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          { id: user._id,accountType:user.accountType},
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
          accountType:accountType,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id,accountType:newUser.accountType},
          process.env.JWT_SECRET
        );
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  };





export const resetPasswordToken = async (req,res,next)=>{
  try{
    const email = req.body.email;
    const user = await User.findOne({email:email});
    if(!user){
      return next(errorHandler(404,'email has not been registered'));
    }
    const token = crypto.randomBytes(20).toString("hex");                          //generate token and we add expiration time in that token and then we add that token
        const updatedDetails = await User.findOneAndUpdate(          // URL so the URL which will be sent to user to reset password will expire after certain time;
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires: Date.now() + 5*60*1000,
                                        },
                                        {new:true});                  // {new:true} added because it return updated object so updatedDetails contain updated details;
        
        const url = `https://article-app-2.onrender.com/update-password/${token}`                              //create url
        await mailSender(email, "Password Reset Link",`Your Link for email verification is ${url}. Please click this url to reset your password.`);   //send mail containing the url
                         
        return res.json({                                                                         //return response
            success:true,
            message:'Email sent successfully, please check email and change pwd',
        });
    }
    catch(error) {
      console.log(error);
      //next(errorHandler(500,'something went wrong while sending rest password token'));
      return res.status(500).json({
        success:false,
        message:'Something went wrong while sending reset pwd token'
    })
    }
}


//resetPassword/
export const resetPassword = async (req, res,next) => {
  try {
      const {password, confirmPassword, token} = req.body;                   //data fetch
      if(password !== confirmPassword) {                                    //validation
          return res.status(404).json({ success:false,  message:'Password not matching',}); 
      }
     
      const userDetails = await User.findOne({token: token});             //get userdetails from db using token
      if(!userDetails) {                                                 //if no entry - invalid token
          return res.json({ success:false,   message:'Token is invalid',  });
      }

      if(!(userDetails.resetPasswordExpires > Date.now())){                 //token time check 
              return res.json({success:false,  message:'Token is expired, please regenerate your token', });    
      }
       
      const encryptedPassword = await bcryptjs.hashSync(password, 10);           //hash password

      //password update IN DB;
      await User.findOneAndUpdate({token:token}, {password:encryptedPassword}, {new:true}, );
      
      return res.status(200).json({                             //return response
          success:true,
          message:'Password reset successful',
      });
  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:'Something went wrong while sending reset pwd mail'
      })
  }
};



