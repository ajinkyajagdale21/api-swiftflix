const express= require('express');
const app= express();
const PORT = process.env.PORT || 8000
const cors = require('cors')
const bodyParser = require('body-parser')
require("dotenv").config();
const {initialConnection} = require('./DBconnection/DBconnect')
const {addVideosToDB} = require('./models/video.model')
const videos = require('./routes/video.route')
const likedVideos = require('./routes/likedvideo.route')
const unlikedVideos= require('./routes/unlikedvideo.route')
const auth= require('./routes/auth.route')

initialConnection();
app.use(cors());
app.use(bodyParser.json())
app.use('/videos',videos)
app.use('/auth',auth)
app.use('/likedvideos',likedVideos)
app.use('/unlikedvideos',unlikedVideos)

//addVideosToDB();
app.get('/',(req,res)=>{
    res.json({success:true,message:"hello express"})
})

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'page not found' })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ success: false, message: 'something went wrong', error: err.message })
})
app.listen(PORT, () => console.log('server started at port', PORT))