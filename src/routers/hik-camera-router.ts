import express, { Request, Response } from "express"
const hikCctvRouter = express.Router();
import * as hikCameraService from "../services/hik-camera-service";

hikCctvRouter.get ( "/cameras", async ( req : Request, res : Response) => {
    const list = await hikCameraService.getCctvList(); 
    res.send ( list );
}) 

hikCctvRouter.get ( "/cameras/:id", async ( req : Request, res : Response) => {
    const list = await hikCameraService.findById(req.params.id); 
    res.send ( list );
}) 

export default hikCctvRouter;