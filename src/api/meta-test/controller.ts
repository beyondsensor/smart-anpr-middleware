import { Request, Response } from "express"
import service from "./service"

async function GetAll(request: Request, response: Response) {
    const res = await service.GetAll();
    response.send(res)
}

async function Update(request: Request, response: Response) {
    console.log("Update ")
    const res = await service.GetAll();
    response.send(res)
}

async function Create(request: Request, response: Response) {
    const { name } = request.body;
    if (request.file) {
        const buffer = Buffer.from(request.file.buffer); 
        console.log(buffer.length); 
        const base64 = buffer.toString("base64")
        //const file = new File([request.file.buffer], request.file.originalname, { type: request.file.mimetype })
        const results = await service.Create(name, base64);
        response.send({results})
    }
}
async function Delete(request: Request, response: Response) {
    const res = await service.GetAll();
    response.send(res)
}


export default {
    GetAll,
    Update,
    Create,
    Delete
}