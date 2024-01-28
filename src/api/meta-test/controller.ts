import { Request, Response } from "express"
import service from "./service"
import appLogger from "../../lib/logger";

async function GetAll ( request : Request, response : Response  ) { 
    const res = await service.GetAll(); 
    response.send ( res)
}

async function Update ( request : Request, response : Response  ) { 
    const res = await service.GetAll(); 
    response.send ( res)
}

async function Create ( request : Request, response : Response  ) { 
    const res = await service.GetAll(); 
    response.send ( res)
}
async function Delete ( request : Request, response : Response  ) { 
    const res = await service.GetAll(); 
    response.send ( res)
}


export default { 
    GetAll, 
    Update, 
    Create, 
    Delete
}