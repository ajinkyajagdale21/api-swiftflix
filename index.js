const express= require('express');
const app= express();
const PORT = process.env.PORT || 8000

app.get('/',(req,res)=>{
    res.json({success:true,message:"hello express"})
})

app.listen(PORT, () => console.log('server started at port', PORT))