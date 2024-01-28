import express from "express"; 
import attendanceTakingController from "./controller";
import multer from 'multer';
const attendanceTakingRouter = express.Router(); 
const upload = multer();

attendanceTakingRouter.get("", attendanceTakingController.GetAll);
attendanceTakingRouter.post (`/on-facial-event`, upload.single('snapshot'), attendanceTakingController.OnFacialEvent ); 

export default attendanceTakingRouter; 