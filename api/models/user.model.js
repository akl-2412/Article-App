import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    }
},
    
    {timestamps:true}
);

const User = mongoose.model('User',userSchema);

export default User;