

import { SimulateVehicleRequest } from "../types/vehicle-tracking";
import { vehicleTrackingConfig, mqttConfig  } from "../config/app-config";
import { makeCameraListener } from "../lib/hikvision/cctv-listener";
import { makeTracker } from "../lib/vehicle-tracker/tracker";
import { makeMqttClient } from "../lib/mqtt";
import appLogger from "../lib/logger";

const cameraListener = makeCameraListener({
    host: "",
    user: "",
    password: "",
    onData: function (message): void {
        appLogger.info(`Received data from Camera`);
        appLogger.debug(`Message Type [${message.type}]`);
        if ( message.type === "VEHICLE" ) {
            const anpr = message.meta.get("anpr") ?? "";
            const image = message.snapshot;
            trackingManager.updateTracker(anpr, image);
        }
    }
});

const mqttClient = makeMqttClient ( {
    
    mqttHost: mqttConfig.mqServerHost,
    mqttUser: mqttConfig.mqUser,
    clientId: mqttConfig.mqUser,
    mqttPassword: mqttConfig.mqPassword,

    onConnect: function (): void {
        appLogger.info ( "Vehicle tracker connected to MQTT Client");
    },
    onMessage: function (topic: string, message: Buffer): void {
        // Do Nothing, since we are just sending things out 
    },
    onError: function (error: any): void {
        appLogger.error ( "MQTT Client Error" );
        appLogger.debug ( error );
    },
    onClose: function (): void {
        appLogger.error ( "MQTT Client Closed" );
    }
})

const trackingManager = makeTracker({

    onVehicleEnter: (tracker) => { 
        appLogger.info ( `Vehicle enter scene : [${tracker.getAnpr()}]`)
        appLogger.debug(`Vehicle leave scene : [${JSON.stringify(tracker.getData())}]`);
        const message = { 
            ... tracker.getData(), 
            type: "vehicle-enter",
            image: tracker.getImage()
        }
        mqttClient.sendMessage ( vehicleTrackingConfig.eventTopic, JSON.stringify(message));
    },

    onVehicleLeave: (tracker) => {
        appLogger.info ( `Vehicle leaving scene : [${tracker.getAnpr()}]`)
        appLogger.debug(`Vehicle leave scene : [${JSON.stringify(tracker.getData())}]`);
        const message = { 
            ... tracker.getData(), 
            type: "vehicle-leave",
            image: tracker.getImage()
        }
        mqttClient.sendMessage ( vehicleTrackingConfig.eventTopic, JSON.stringify(message));
    },

    onVehicleWarning: (tracker) => {
        appLogger.info ( `Vehicle dwelling warning : [${tracker.getAnpr()} with a dwelltime of ${tracker.getDwelltime()}ms ]`)
        appLogger.debug(`Vehicle warning scene : [${JSON.stringify(tracker.getData())}]`)
        const message = { 
            ... tracker.getData(), 
            type: "vehicle-warning",
            image: tracker.getImage()
        }
        mqttClient.sendMessage ( vehicleTrackingConfig.eventTopic, JSON.stringify(message));
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