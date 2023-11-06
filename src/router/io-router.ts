import { mqttConfig } from "../config/app-config";
import express, { Request, Response } from "express"
const ioRouter = express.Router();
import * as ioService from "../services/io-service";
import appLogger from "../utilities/logger";

ioRouter.get ( "/config", async ( req : Request, res : Response ) => { 
    res.send ({
        date: ( new Date().toISOString()), 
        config: { 
            ... mqttConfig, 
            mqUser: undefined, 
            mqPassword: undefined
        }
    });
})

ioRouter.get ( "/status", async ( req : Request, res : Response ) => { 
    const results = await ioService.getStatus ();
    res.send ( results );  
})

ioRouter.post ( "/trigger", async ( req : Request, res : Response ) => { 
    const results = await ioService.triggerIOSignal ( { bit: req.body.bit, ioPort: req.body.port });
    res.send ( results );  
})

ioRouter.post ( "/debugging/send-mq", async ( req : Request, res : Response ) => { 
    const body = req.body; 
    appLogger.debug ( JSON.stringify(body) );
    const results = await ioService.sendMessage ( JSON.stringify(body) );
    res.send ( {
        message : "Success"
    } );
})

export default ioRouter;