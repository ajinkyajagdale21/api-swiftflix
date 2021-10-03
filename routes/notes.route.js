const express= require('express')
const router = express.Router();
const {Note} = require('../models/notes.model')
const {verifyToken} = require('../middleware/verifyToken');
const { extend } = require("lodash");

router.route('/')
    .get(async(req,res)=>{
        try{
            let notes= await Note.find({})
            res.status(200).json({sucess:true,notes})
        }
        catch(error){
            res.status(400).json({sucess:false,message:"Unable to fetch notes please try again!!"})
        }
    })

router.use(verifyToken);

router.route('/:userId')
    .get(async(req,res)=>{
        const {userId} = req;
        const notes= await Note.findOne({uid:userId})
       try{
            if(notes){
            return res.status(200).json({ success: true, notes })
            }
            return res.status(400).json({
                success: false,
                message: "notes Not Found Please Sign Up!!",
              });
        }
        catch(error){
            res.status(404).json({ success: false, message: error.message });
        }
    })
    .post(async(req,res)=>{
        const {userId} = req;
        let notes= await Note.findOne({uid:userId})
        const {playId,text} = req.body;
        try{
            notes.notes.push({playId,text})
            notes= await notes.save();
            res.status(201).json({ success: true, note: notes.notes[notes.notes.length - 1] });
        }
        catch(error){
            res.status(400).json({ success: false, message: error.message });
        }
    })
    
router.route('/:userId/:noteId')
    .post(async(req,res)=>{
        const {userId}= req;
        const {noteId}= req.params;
        const updateNote = req.body;
        try{
            let userNotes = await Note.findOne({uid:userId})
            let note= userNotes.notes.find(item=>item._id==noteId)
            if(note){
                note = extend(note,updateNote)
                await userNotes.save()
                return res.status(200).json({ success: true, note });
            }
            res.status(400).json({ success: false, message: "note not found" });
        }
        catch(error){
            res.status(400).json({ success: false, message: error.message });
        }
    })
    .delete(async(req,res)=>{
        const {userId}= req;
        const {noteId}= req.params;
        let userNotes = await Note.findOne({uid:userId})
        try{
            const note = userNotes.notes.find(item=>item._id==noteId)
            if(note){
                userNotes.notes.pull({_id:noteId})
                await userNotes.save();
                res.status(200).json({ success: true, note });
            }
        }
        catch(error){
            res.status(400).json({ success: false, message: error.message });
        }
    })

module.exports = router;