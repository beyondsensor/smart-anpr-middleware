import express, { Request, Response } from "express"
import { getApplicationSettings } from "../services/backend-service";
const configRouter = express.Router();

configRouter.get ( "/application-settings", async ( req : Request, res : Response ) => { 
    const results = await getApplicationSettings ();
    res.send ( results)
});

export default configRouter;