const express= require('express');
const router = express.Router()
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const {User} = require('../models/user.model')
const {LikedVideo} = require('../models/likedvideo.model')
const {Note} = require('../models/notes.model')
const {UnlikedVideo} = require('../models/unlikedVideo.model')
const {WatchLater} = require('../models/watchLater.model')

router.route('/signup')
    .post(async(req,res)=>{
        const user = req.body;
        try{
        const checkUser= await User.findOne({email:user.email})
        if(checkUser){
           return res.status(403).json({success:false,message:"User Already Present Please Login!!"})
        }
        const NewUser= await User(user) 
        const salt = await bcrypt.genSalt(10)
        NewUser.password = await bcrypt.hash(NewUser.password,salt)
        await NewUser.save();
        const NewLikedVideo = await LikedVideo({uid:NewUser._id,items:[]});
        await NewLikedVideo.save()
        const NewUnlikedVideo= await UnlikedVideo({uid:NewUser._id,items:[]})
        await NewUnlikedVideo.save()
        const NewWatchLater = await WatchLater({uid:NewUser._id,items:[]})
        await NewWatchLater.save()
        const newNote = await Note({uid:NewUser._id,notes:[]})
        await newNote.save()
        res.status(200).json({success:true,NewUser})
    }
    catch(error){
        res.status(400).json({success:false,message:error.message})
    }
    })

router.route('/login')
    .post(async(req,res)=>{
        const {email,password} = req.body;
        try{
            const user= await User.findOne({email})
            if(user){
                const validPassword = await bcrypt.compare(password,user.password)
                if(validPassword){
                    const token= jwt.sign({userId:user._id},process.env.KEY,{
                        expiresIn:'24h'
                    });
                    res.status(200).json({name:user.firstName,token,userId:user._id})
                }else {
                    return res
                      .status(401)
                      .json({ success: false, message: "Incorrect Password" });
                  }
            }else {
                return res
                  .status(401)
                  .json({ success: false, message: "User not found ! Please Sign Up" });
              }
        }
        catch(error){
            res.status(400).json({ success: false, message: error.message });
        }
    })


module.exports= router;