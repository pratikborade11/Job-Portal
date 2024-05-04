import express from "express";
import { getAllJobs , postJob , getMyJobs , updateJob , deleteMyJob , getSingleJob } from "../controllers/jobController.js"
import {isAuthorized} from "../middlewares/auth.js";

const router = express.Router();

router.get("/getalljobs" , getAllJobs);
router.post("/post",isAuthorized,postJob);
router.get("/getmyjobs",isAuthorized,getMyJobs);
router.put("/updatejob/:id",isAuthorized,updateJob);
router.get("/job/:id",isAuthorized,getSingleJob);
router.delete("/deletejob/:id",isAuthorized,deleteMyJob);


export default router;
