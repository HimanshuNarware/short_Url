const mongoose= require('mongoose');
// const { error } = require('./Utils/ResponseWrapper');

module.exports= async ()=>{
    try{
  const uri=process.env.MONGOURL;
      const connect= await mongoose.connect(uri)
        console.log('connnected to ', connect.connection.host);
    }catch(e){
        console.log(e,'unable to connect to server')
        process.exit(1);
    }
}

