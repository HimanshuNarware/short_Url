const express = require('express');
const router = express.Router();

router.use((req,res,next)=>{

    console.log("inside the middleware",req)
    next();
})  

module.exports = router