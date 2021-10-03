const express= require('express');
const router= express.Router();
const {WatchLater} = require('../models/watchLater.model')
const { verifyToken } = require('../middleware/verifyToken')

router.route('/')
    .get(async(req,res)=>{
        try{
            let watchLater = await WatchLater.find({})
            res.status(200).json({ success: true, watchLater });
        }
        catch(error){
            res.status(400).json({
                success: false,
                message: "Unable to fetch watchlater Videos ! PLease try again",
              });
        }
    })
router.use(verifyToken)

router.route('/:userId')
    .get(async(req,res)=>{
        const {userId} = req;
        try{
            let watchLater= await WatchLater.findOne({uid:userId})
            if (watchLater) {
                watchLater = await watchLater.populate("items._id").execPopulate();
                const NormalizedWatchlater = watchLater.items.map(
                  (item) => item._id._doc
                );
                return res.status(200).json({ success: true, watchLater: NormalizedWatchlater });
              }
              return res.status(400).json({
                success: false,
                message: "watchlater Not Found Please Sign Up!!",
              });
        }
        catch(error){
            res.status(404).json({ success: false, message: error.message });
        }
    })
    .post(async(req,res)=>{
        const {userId} = req;
        const {playId} = req.body;
        let watchLater = await WatchLater.findOne({ uid: userId });
    try {
      if (watchLater.items.some((each) => each._id == playId)) {
        return res.json({ success: false, message: "Video is already in watchlater" });
      }
      watchLater.items.push({ _id: playId });
      watchLater = await watchLater.save();
      watchLater = await watchLater.populate("items._id").execPopulate();
      const NormalizedWatchlater = watchLater.items.map(
        (item) => item._id._doc
      );
      const video = NormalizedWatchlater.find((each) => each._id == playId);
      if (video) {
        res.status(201).json({ success: true, video });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }

    })

router.route('/:userId/:playId')
    .delete(async(req,res)=>{
        let { userId } = req;
        let watchLater = await WatchLater.findOne({ uid: userId });
        const { playId } = req.params;
        try {
          const video = watchLater.items.find((each) => each._id == playId);
          if (video) {
            watchLater.items.pull({ _id: playId });
            await watchLater.save();
            res.status(200).json({ success: true, video });
          }
        } catch (error) {
          res.status(400).json({ success: false, message: error.message });
        }
    })
module.exports = router