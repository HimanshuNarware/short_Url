 const success=(statusCode,message)=>{
    return{
        status:'ok',
        statusCode,
        message
    }

}

const error=(statusCode,message)=>{
    return{
        status:'failed',
        statusCode,
        message
    }
}

module.exports={
    error,
    success
}