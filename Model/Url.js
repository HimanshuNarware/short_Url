const mongoose= require('mongoose');

const urlSchema=  mongoose.Schema({
    url:{
        type:String,
        require:true,

    },
    name:{
        type:String
    }
    ,
    nnid:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model('url',urlSchema)