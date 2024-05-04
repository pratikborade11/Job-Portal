import express from "express";
import { employerGelAllApplications , jobseekerGelAllApplications , jobseekerDeleteApplication , postApplication , applicationStatus } from "../controllers/applicationController.js";
import { isAuthorized  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/jobseeker/getall",isAuthorized,jobseekerGelAllApplications);
router.get("/employer/getall",isAuthorized,employerGelAllApplications);
router.delete("/delete/:id",isAuthorized,jobseekerDeleteApplication);
router.post("/application/post",isAuthorized,postApplication);
router.put("/applications/:id/status", isAuthorized, applicationStatus);

export default router;
