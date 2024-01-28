import { getXataClient } from "../../db/xata";
import { CreateFacialEventSchema } from "./types"
const xata = getXataClient(); 

async function OnFacialEvent ( meta : any, snapshotInBase64 : string ) { 
    const results = CreateFacialEventSchema.safeParse ( meta ); 
    if ( results.success ) { 
        const meta = results.data;
        xata.db.AccessControlEvent.create ( {

        });
    } else { 
        throw { status: 400, message: "Invalid Meta Data"}
    }
    return {};
}

const AttendanceTakingService = { 
    OnFacialEvent
}

export default AttendanceTakingService; 