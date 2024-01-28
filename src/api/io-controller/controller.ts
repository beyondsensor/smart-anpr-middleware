import { Request, Response } from "express"
import { ioService } from "./service";


async function getConfig ( req : Request, res : Response) { 
    const config = ioService.getConfig();
    res.send ( config );  
}


async function getStatus ( req : Request, res : Response) { 
    const status = ioService.getStatus();
    res.send ( status );  
}

async function getState ( req : Request, res : Response) { 
    const state = ioService.getState();
    res.send ( state );
}

async function triggerIo ( req : Request, res : Response) { 
    const { doId , value } = req.body;
    console.log ( doId , value)
    res.send ( ioService.trigger ( doId, value ) )
}

async function triggerAllIo ( req : Request, res : Response) { 
    const { doId , value } = req.body;
    console.log ( doId , value)
    res.send ( ioService.triggerAll ( value ) )
}

const ioController = { 
    getConfig, 
    getState, 
    getStatus,
    triggerAllIo, 
    triggerIo
}

export default ioController;