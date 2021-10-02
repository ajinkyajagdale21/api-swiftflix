const mongoose = require('mongoose');
const {Schema}= mongoose;

const UnlikedVideoSchema= new Schema({
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[{
        _id:{
            type:String,
            ref:'Video'
        }
    }]
})

const UnlikedVideo= mongoose.model('UnlikedVideo',UnlikedVideoSchema)

module.exports= {UnlikedVideo}