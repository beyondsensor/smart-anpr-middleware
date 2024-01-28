import express from "express";
import controller from "./controller";
const metaTestRouter = express.Router();

metaTestRouter.get("/api/meta-tests", controller.GetAll);
metaTestRouter.post("/api/meta-tests", controller.Create);
metaTestRouter.put("/api/meta-tests", controller.Create);
metaTestRouter.delete("/api/meta-tests", controller.Delete);
metaTestRouter.patch("/api/meta-tests", controller.Update);

export default metaTestRouter; 