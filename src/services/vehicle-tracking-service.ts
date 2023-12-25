

import { makeTracker } from "../utilities/vehicle-tracker/tracker";
import appLogger from "../utilities/logger";
import { makeAnprCameraListener } from "../utilities/hikvision/anpr-camera-listener";
import { SimulateVehicleRequest } from "../types/vehicle-tracking";
import { application } from "express";

const cameraListener = makeAnprCameraListener({
    host: "",
    user: "",
    password: "",
    onData: function (message: any): void {
        const { anpr, image } = message;
        appLogger.info(`Received data from Camera`);
        trackingManager.updateTracker(anpr, image);
    }
});

const trackingManager = makeTracker({

    onVehicleLeave: (tracker) => {
        appLogger.debug(`Vehicle leave scene : [${JSON.stringify(tracker.getData())}]`)
    },

    onVehicleWarning: (tracker) => {
        appLogger.debug(`Vehicle warning scene : [${JSON.stringify(tracker.getData())}]`)
    },

});

export const trackingService = {
    getTrackers: () => trackingManager.getTrackers().map(t => t.getData()),

    emulateUpdateTracker: (anpr: string, image: string) => trackingManager.updateTracker(anpr, image), 

    emulateVehiceData: ( request : SimulateVehicleRequest ) => { 

        let count = 0;
        const iterations = Math.ceil(request.timeInScene / request.intervalPerTick)
        const interval = setInterval ( () => { 
            appLogger.debug ( `[${request.anpr}] tick [${count} of ${iterations}]`);
            trackingManager.updateTracker ( request.anpr, request.image );
            count++;
            if ( count >= iterations )
                clearInterval ( interval );
        }, request.intervalPerTick);

        return { 
            message : "Success", 
            request : { ... request }
        }
    }
}