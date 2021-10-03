const express= require('express');
const { UnlikedVideo } = require('../models/unlikedVideo.model');
const router = express.Router();
const {verifyToken} = require('../middleware/verifyToken')

router.route('/')
    .get(async(req,res)=>{
        try{
            const unLikedVideos = await UnlikedVideo.find({})
            res.status(200).json({ success: true, unLikedVideos });
        }
        catch(error){
            res.status(400).json({success: false,message: "Unable to fetch unLiked Videos ! PLease try again"});
        }
    })

router.use(verifyToken);

router.route('/:userId')
    .get(async(req,res)=>{
        const {userId}= req
        try{
            let unLikedVideos = await UnlikedVideo.findOne({uid:userId})
            if(unLikedVideos){
                unLikedVideos = await unLikedVideos
                .populate("items._id")
                .execPopulate();
              const NormalizedUnLikedVideos = unLikedVideos.items.map(
                (item) => item._id._doc
              );
              return res
                .status(200)
                .json({ success: true, unlikedVideos: NormalizedUnLikedVideos });
            }
        return res.status(400).json({
            success: false,
            message: "unLikedVideos Not Found Please Sign Up!!",
          });
    }
    catch(error){
        res.status(404).json({ success: false, message: error.message });
    }
    })
    .post(async(req,res)=>{
        const {userId} = req;
        const {playId}= req.body;
        let unLikedVideos = await UnlikedVideo.findOne({uid:userId})
        try{
            if(unLikedVideos.items.some(item=>item._id==playId)){
                return res.json({ success: false, message: "Video is Already Liked" });
            }
            unLikedVideos.items.push({_id:playId})
            unLikedVideos = await unLikedVideos.save();
            unLikedVideos = await unLikedVideos.populate("items._id").execPopulate();
            const NormalizedUnLikedVideos = unLikedVideos.items.map(
            (item) => item._id._doc
                );
            const video = NormalizedUnLikedVideos.find((each) => each._id == playId);
            if (video) {
            res.status(201).json({ success: true, video });
            }
        }
        catch(error){
            res.status(400).json({ success: false, message: error.message });
        }
    })

router.route('/:userId/:playId')
    .delete(async(req,res)=>{
        const {userId} = req;
        const {playId} = req.params;
        const unLikedVideos= await UnlikedVideo.findOne({uid:userId})
        try{
            const video= unLikedVideos.items.find(item=>item._id==playId)
            if(video){
                unLikedVideos.items.pull({_id:playId})
                await unLikedVideos.save();
                res.status(200).json({ success: true, video });
            }
        }
        catch(error){
            res.status(400).json({success:false,message:error.message})
        }
    })
module.exports = router