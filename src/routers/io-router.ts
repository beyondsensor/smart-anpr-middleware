import express, { Request, Response } from "express"
const ioRouter = express.Router();
import { ioService } from "../services/io-service";

ioRouter.get ( "/config", ( req : Request, res : Response) => {
    const config = ioService.getConfig();
    res.send ( config );
} ) 


ioRouter.get ( "/status", ( req : Request, res : Response) => {
    const status = ioService.getStatus();
    res.send ( status );
} ) 

ioRouter.get ( "/state", ( req : Request, res : Response) => {
    const state = ioService.getState();
    res.send ( state );
} ) 


ioRouter.post ( "/trigger-io", ( req : Request, res : Response) => { 
    const { doId , value } = req.body;
    console.log ( doId , value)
    res.send ( ioService.trigger ( doId, value ) )
})

ioRouter.post ( "/trigger-io/all", ( req : Request, res : Response) => { 
    const { doId , value } = req.body;
    console.log ( doId , value)
    res.send ( ioService.triggerAll ( value ) )
})


export default ioRouter;