const express= require('express')
const router = express.Router();
const {Video} = require('../models/video.model')

router.route('/')
    .get(async(req,res)=>{
        try{
            const videos= await Video.find({})
             res.status(200).json({success:true,videos})
        }
        catch(error){
            res.status(400).json({success:false,message:"can't fetch videos"})
        }
        
    })

router.param('playId',async(req,res,next,playId)=>{
   const video= await Video.findOne({playId})
   if(!video){
     return res.status(400).json({success:false,message:"video not found"})
   }
   req.video= video;
   next();
})

router.route('/:playId')
    .get((req,res)=>{
    const {video}= req;
    video.__v = undefined;
    res.status(200).json({success:true,video})
})

module.exports=router