import express, { Request, Response } from "express"
import { VehicleEnterEvent, VehicleLeaveEvent as VehicleExitEvent } from "../types/vehicle-tracker-types";
import { vehicleTrackingService } from "../services/vehicle-tracking-service";
const eventRouter = express.Router();

eventRouter.post ( "/vehicle-enter", async ( req : Request, res : Response ) => { 
    const body : VehicleEnterEvent = req.body;
    vehicleTrackingService.onVehicleEnter ( body );
    res.send ( { 
        body: body
    })
});

eventRouter.post ( "/vehicle-exit", async ( req : Request, res : Response ) => { 
    const body : VehicleExitEvent = req.body;
    vehicleTrackingService.onVehicleExit ( body );
    res.send ( { 
        body: body
    })
});

export default eventRouter;