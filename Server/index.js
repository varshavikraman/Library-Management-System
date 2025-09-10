import express, {json} from 'express';
import dotenv from 'dotenv';
import { userRoute } from './Router/userRouter.js';
import { adminRoute } from './Router/adminRouter.js';
import mongoose from 'mongoose';

dotenv.config();

const app=express();

app.use(json());

app.use('/',userRoute);
app.use('/',adminRoute);

mongoose.connect('mongodb://mongodb:27017/Athenaeum').then(()=>{
     console.log('mongoDB is connected successfully to Athenaeum');
     })
     .catch((error)=>{
         console.error('MongoDB connection failed',error);
     });
     

app.listen(process.env.PORT,function(){
     console.log(`server is listening at ${process.env.PORT}`);
     
})