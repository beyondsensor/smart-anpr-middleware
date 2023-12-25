import express, { Request, Response } from "express"
import { trackingService } from "../services/vehicle-tracking-service";
import { vehicleEnterRequestSchema, VehicleEnterRequest, simulateVehicleRequestSchema, SimulateVehicleRequest } from "../types/vehicle-tracking";
const trackerRouter = express.Router();

trackerRouter.get("/", async (req: Request, res: Response) => {
    const results = trackingService.getTrackers();
    res.json(results);
});

trackerRouter.post("/emulator/on-vehicle-detected", async (req: Request, res: Response) => {
    const results : VehicleEnterRequest = vehicleEnterRequestSchema.parse(req.body);
    trackingService.emulateUpdateTracker(results.anpr, results.image);
    res.send ( "Successfull");
})

trackerRouter.post("/emulator/simulate-vehicle-data",async (req: Request, res: Response) => {
    const request : SimulateVehicleRequest = simulateVehicleRequestSchema.parse ( req.body );
    const response = trackingService.emulateVehiceData(request);
    res.json(response);
})

export default trackerRouter;