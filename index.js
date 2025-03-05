const express= require('express');
const {success} =require('./Utils/ResponseWrapper')
const dotenv= require('dotenv');
const connectDB= require('./DbConnect')
dotenv.config(path='./.env')
const Api = require(`./Router/Api`);
const morgan = require('morgan');
const cors=require('cors');
const { getOriginalUrlController } = require('./Controller/UrlController');

// middleware and router
const app = express();
app.use('/api',Api);
app.use(morgan('combined'))
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send('Home url page')
})

app.get('/:id',getOriginalUrlController)

const port= process.env.PORT || 4000
connectDB();

app.listen(port,()=>{
    console.log(`server is runnning of the port${port}`)
})
