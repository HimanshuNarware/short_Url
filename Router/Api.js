const router= require('express').Router()
const { success } = require('../Utils/ResponseWrapper')
const url= require('./Url')
const settings = require('./Settings')

router.get('/',(req,res)=>{
    res.send(success(200,'on api page'))
})

router.use('/url',url);
router.use('/settings', settings);

 module.exports= router