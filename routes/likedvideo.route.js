const {LikedVideo} = require('../models/likedvideo.model')
const express= require('express')
const router = express.Router();
const {verifyToken} =  require('../middleware/verifyToken')

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

router.use(verifyToken);

router.route('/:userId')
    .get(async(req,res)=>{
        const {userId} = req
        try{
            let likedVideos= await LikedVideo.findOne({uid:userId})
            if(likedVideos){
                likedVideos= await likedVideos.populate("items._id").execPopulate();
                const NormalizedLikedVideos = likedVideos.items.map(
                    (item) => item._id._doc
                  );
                  return res
                    .status(200)
                    .json({ success: true, likedVideos: NormalizedLikedVideos });
            }
                    return res.status(400).json({
                        success: false,
                        message: "LikedVideos Not Found Please Sign Up!!",
                      });
        }
        catch(error){
            res.status(404).json({ success: false, message: error.message });
        }
    })
    .post(async(req,res)=>{
        const {userId}= req
        const {playId} = req.body;
        let likedVideos= await LikedVideo.findOne({uid:userId})
        try{
            if(likedVideos.items.some(item=>item._id==playId)){
              return res.json({success:false,message:"Video is already liked"})
            }
            likedVideos.items.push({_id:playId})
            likedVideos = await likedVideos.save();
            likedVideos = await likedVideos.populate("items._id").execPopulate();
            const NormalizedLikedVideos = likedVideos.items.map(
                (item) => item._id._doc
            );
            const video = NormalizedLikedVideos.find((each) => each._id == playId);
            if (video) {
                res.status(201).json({ success: true, video });
            }
        }catch(error){
            res.status(400).json({ success: false, message: error.message });
        }
    })


module.exports= router
