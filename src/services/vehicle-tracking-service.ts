import { VehicleEnterEvent, VehicleLeaveEvent, VehicleTracker } from "../types/vehicle-tracker-types";
import { trackerConfig } from "../config/app-config";
/// Tracking Object for Trackers 
const trackers: Map<string, VehicleTracker> = new Map<string, VehicleTracker>();


export const vehicleTrackingService = { 
    onVehicleEnter, 
    onVehicleExit
}

/**
 * Trigger that a Vehicle has Entered
 * @param ev Event Informaiton 
 */
function onVehicleEnter(ev: VehicleEnterEvent) {
    if (trackers.has(ev.anpr)) {
        console.log(`[ ${new Date().toISOString()}] [${ev.anpr}] Vehicle already tracked`);
    } else {
        // 1. Create a Tracker Instance and Start Managing It 
        const tracker = makeVehicleTracker(ev);
        trackers.set(ev.anpr, tracker);
    }
}

/**
 * When a Vehicle Left the Scene 
 * @param ev 
 */
function onVehicleExit(ev: VehicleLeaveEvent) {
    console.log(`[ ${new Date().toISOString()}] [${ev.anpr}] Vehicle Left Area Event Received`);
    removeTracker(ev.anpr);
}

/**
 * Remove the Tracker, which typically meant that the Vehcile is no longer there 
 * @param anpr 
 */
function removeTracker(anpr: string) {
    console.log(`[${new Date().toISOString()}] [${anpr}] Removed from Vehicle Tracker`);
    const t = trackers.get(anpr);
    t?.stop();
    trackers.delete(anpr);
}

/**
 * Create a Tracker 
 * @param ev 
 * @returns 
 */
function makeVehicleTracker(ev: VehicleEnterEvent): VehicleTracker {

    console.log(`[${new Date().toISOString()}] [${ev.anpr}] Vehicle Tracking Started for Vehicle`);
    console.log ( trackerConfig );

    /// When Triggered, a warning Message is sent  
    const warningTimeout = setTimeout(() => {
        // If the Timeout is reached, start Tracking the Subject 
        console.log(`[${new Date().toISOString()}] [${ev.anpr}] Vehicle Warning Triggered `);
        const warning = {
            warningInSeconds: trackerConfig.triggerTime,
            ev: ev
        }
        /// TODO : Send Warning to MQ Server for Triggers 
        /// TODO : Trigger Alarm via MQ Controller 
    }, trackerConfig.warningTime);
    /// When Triggered, it means that the Object is automatically deleted 
    const triggerTimeout = setTimeout(() => {
        console.log(`[${new Date().toISOString()}] [${ev.anpr}] Vehicle Recorded for Illegal Parking`);
        removeTracker(ev.anpr);
        /// TODO : Send to Backend if the Vehicle stays Beyond This 
        /// TODO : Send a Message to Stop the Warning Trigger 
    },  trackerConfig.triggerTime);

    /// Stop the Trigger Altogether 
    function stopTracker() {
        console.log(`[${new Date().toISOString()}] [${ev.anpr}] Tracker Stopped`);
        clearTimeout(warningTimeout);
        clearTimeout(triggerTimeout);
    }

    /// Return the Tracking Object 
    return {
        anpr: ev.anpr,
        snapshot: ev.snapshotInBase64,
        warningTimeout: warningTimeout,
        triggerTimeout: triggerTimeout,
        stop: stopTracker,
    };
}



