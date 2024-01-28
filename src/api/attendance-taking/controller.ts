import { Request, Response } from "express"; 
import AttendanceTakingService from "./service";

const attendanceTakingController = { 
    OnFacialEvent: async function ( req : Request, res : Response ) {
        const file = req.file; 
        if ( file ) { 
            const base64Image = Buffer.from(file.buffer).toString("base64");
            const eventString : string = req.body.event;
            const eventMeta = JSON.stringify( eventString );
            const results = await AttendanceTakingService.OnFacialEvent( eventMeta, base64Image );
            res.send ( results)
        } else { 
            res.status(400).send( { message: "Bad Request"} );
        }
    }, 

    GetAll: async function ( req : Request, res : Response ) { 
        const records = await AttendanceTakingService.GetAllFacialEvents(); 
        res.send ( records );
    }
}


export default attendanceTakingController; 




