const mongoose = require('mongoose');
const {Schema}= mongoose;

const WatchLaterSchema= new Schema({
    uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            type:String,
            ref:'Video'
        }
    ]
})

const WatchLater= mongoose.model('WatchLater',WatchLaterSchema)

module.exports= {WatchLater}