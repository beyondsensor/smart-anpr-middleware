import express, { Request, Response } from "express"
import ioController from "./controller";
const ioRouter = express.Router();

ioRouter.get ( "/config", ioController.getConfig ) 
ioRouter.get ( "/status", ioController.getStatus ) 
ioRouter.get ( "/state", ioController.getState ) 
ioRouter.post ( "/trigger-io", ioController.triggerIo)
ioRouter.post ( "/trigger-io/all", ioController.triggerAllIo )

export default ioRouter;