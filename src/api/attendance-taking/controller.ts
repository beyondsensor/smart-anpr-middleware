import { Request, Response } from "express"; 
import AttendanceTakingService from "./service";

const attendanceTakingController = { 
    OnFacialEvent: async function ( req : Request, res : Response ) {
        const file = req.file; 
        if ( file ) { 
            const base64Image = Buffer.from(file.buffer).toString("base64");
            const results = await AttendanceTakingService.OnFacialEvent( req.body, base64Image );
            res.send ( results)
        }
    }, 
}


export default attendanceTakingController; 




