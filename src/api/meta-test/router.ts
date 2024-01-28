import express from "express";
import controller from "./controller";
import multer from 'multer';

const metaTestRouter = express.Router();

// Create an instance of multer middleware
const upload = multer();
metaTestRouter.get("/api/meta-tests", controller.GetAll);
metaTestRouter.post("/api/meta-tests", controller.Create);
metaTestRouter.put("/api/meta-tests", upload.single('snapshot'), controller.Create);
metaTestRouter.delete("/api/meta-tests", controller.Delete);
metaTestRouter.patch("/api/meta-tests", controller.Update);

export default metaTestRouter; 