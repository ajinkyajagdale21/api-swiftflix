const {LikedVideo} = require('../models/likedvideo.model')
const express= require('express')
const router = express.Router();

router.route('/')
    .get(async(req,res)=>{
        try{
            const likedvideos= await LikedVideo.find({})
            res.status(200).json({success:true,likedvideos})
        }
        catch{
            res.status(400).json({success:false,message:"could not find Likedvideos"})
        }
    })

router.route('/:userId')
    .get(async(req,res)=>{
        res.send("to be continued")
    })


module.exports= router
