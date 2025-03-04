const Url = require("../Model/Url");
const { success, error } = require("../Utils/ResponseWrapper")
const {nanoid}= require('nanoid')
const getUrlShortnerController = async(req,res)=>{
   try{
    const nnid=nanoid(8);
    const {url,name}= req.body;
    // console.log("testinh",url)
    if(!url){
        return res.send(error(401,'url is require'))
    }
    const result=await Url.create({
        url
        ,name
        ,nnid
    })

    //  window.replace(result.message.url);()
    // res.redirect
    // console.log("data",result.data.message.url)
    return res.send(success(200,result)
)
   }catch(e){
    return res.send(error(500,e.message))
   }
}

const getOriginalUrlController= async(req,res)=>{
  try { const nnid= req.params.id;
    
    if(!nnid){
        return res.send(error(401,'Invailid url'))
    }
    const originalUrl= await Url.findOne({nnid});

    if(!originalUrl){
        return res.send(error(404,'Url not found'))
    }
    
    console.log(originalUrl)
    // res.send(originalUrl)
    return res.redirect(originalUrl.url)
    // return res.redirect(originalUrl.url)
    }catch(e){
        res.send(error(404,e.message));
    }
}
module.exports={
    getUrlShortnerController,
    getOriginalUrlController
}