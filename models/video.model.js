const mongoose = require('mongoose');
const {Schema}= mongoose;
const {data} = require('../dataSet/data')

const VideoSchema= new Schema({
    playId:{
        type:String,
        required: [true,"play id is required"]
    },
    thumbnail:{
        type:String,
        required:[true,"thumbnail is required"]
    },
    title:{
        type:String,
        required:[true,"title is required"]
    },
    channel:{
        type:String,
        required:[true,"channel name is required"]
    },
    timestamp:{
        type: String
    },
    image:{
       type:String,
       required:[true, "image is required"]
    }

})

const Video= mongoose.model('Video',VideoSchema);

const addVideosToDB=()=>{
    data.forEach(async (video)=>{
    const newVideo= new Video(video);
    try{
        await newVideo.save()
    }    
    catch(error){
        console.log("error while adding videos to DB",error)
    }
})
}
module.exports = {addVideosToDB,Video}