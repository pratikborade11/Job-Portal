import express from "express"
import { config } from "dotenv";

import cors from "cors"; //use to connect backend to frontend
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from './routes/userRouter.js';
import applicationRouter from './routes/applicationRouter.js';
import jobRouter from './routes/jobRouter.js';
import {dbConnect} from './database/dbConnect.js';
import { errorMiddleware } from "./middlewares/error.js";




const app = express();
config({ path: "./config/config.env" });

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true, // allowing credentials
    methods : ['GET','POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] // custom headers
  };
  
  app.use(cors(corsOptions));


app.use(cookieParser());//for user authorization
app.use(express.json());
app.use(express.urlencoded({extended:true})); //conv string into json format

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    })
);

app.use('/api/v1/user',userRouter);
app.use('/api/v1/user',applicationRouter);
app.use('/api/v1/user',jobRouter);

dbConnect();

app.use(errorMiddleware);

export default app;