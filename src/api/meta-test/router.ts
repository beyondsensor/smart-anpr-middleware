import express from "express";
import controller from "./controller";
import multer from 'multer';

/// Making use of Multer to manage the Form Data Imageries
const upload = multer();
const metaTestRouter = express.Router();

// Create an instance of multer middleware
metaTestRouter.get("", controller.GetAll);
metaTestRouter.post("", controller.Create);
metaTestRouter.put("", upload.single('snapshot'), controller.Create);
metaTestRouter.delete("", controller.Delete);
metaTestRouter.patch("", controller.Update);

export default metaTestRouter; 