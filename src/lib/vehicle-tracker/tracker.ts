import appLogger from "../logger";
import { vehicleTrackingConfig } from "../../config/app-config";
import { SceneState, WarningState } from "../../types/vehicle-tracking";

export class VehicleTracker {

    private anpr: string;
    private image: string = "";
    private cameraId: string = "";
    private start: number = Date.now();
    private lastUpdated: number = Date.now();

    constructor(anpr: string) {
        this.anpr = anpr;
    }

    update(image: string) {
        this.lastUpdated = Date.now();
        this.image = image;
    }

    getLastSeen() {
        return Date.now() - this.lastUpdated;
    }

    getDwelltime() {
        return (this.lastUpdated - this.start);
    }

    getAnpr() { return this.anpr; }

    getImage() { return this.image; }

    getCameraId () { return this.cameraId; }

    getData() {
        return {
            anpr: this.anpr,
            start: new Date(this.start).toISOString(),
            lastUpdated: new Date(this.lastUpdated).toISOString(),
            dwellTime: this.getDwelltime(),
            lastSeen: this.getLastSeen()
            //image: this.image, 
        }
    }
}

export function makeTracker(props: {
    onStatusUpdate: (scene : SceneState ) => void;
}) {

    const trackers = new Map<string, VehicleTracker>();

    function getTrackers() {
        return Array.from(trackers.entries()).map(([key, instance]) => instance);
    }

    function getTracker(anpr: string, image: string) {
        let instance = trackers.get(anpr);
        if (instance === undefined) {
            appLogger.info(`New vehicle enter scene: [ ${anpr} ]`)
            instance = new VehicleTracker(anpr);
            trackers.set(anpr, instance);
            instance.update(image);
            //onVehicleEnter(instance);
        }
        return instance;
    }

    function updateTracker(anpr: string, image: string) {
        getTracker(anpr, image).update(image);
    }

    function tick() {
        appLogger.debug("Vehicletracker : tick");
        getTrackers().forEach(t => {

            // Check if the Vehicle is already Out 
            if (t.getLastSeen() > vehicleTrackingConfig.expiryTime) {
                //onVehicleLeave(t);
                trackers.delete(t.getAnpr())
            } else {
                if (t.getDwelltime() > vehicleTrackingConfig.warningTime) {
                    //onVehicleWarning(t);
                }
            }
        })
        props.onStatusUpdate ( getCurrentState() );
    }

    function getCurrentState() : SceneState {
        
        /// Sort the Vehicle Lists  
        const vehicles = getTrackers().map(t => {
            return {
                anpr: t.getAnpr(),
                dwellTime: t.getDwelltime()
            }
        }).sort((a, b) => b.dwellTime - a.dwellTime);
        
        ///Check if there is any violations in the first place 
        const hasViolation = vehicles.length > 0 && vehicles[0].dwellTime > vehicleTrackingConfig.warningTime;
        /// Get the First Instance to manage the delivery if there is Violation
        const currentVehicle : WarningState | undefined = hasViolation ? {
            anpr:  vehicles[0].anpr, 
            dwellTime: vehicles[0].dwellTime, 
            snapshot: trackers.get(vehicles[0].anpr)?.getImage()??""
        } : undefined;

        return { 
            hasViolation: hasViolation, 
            currentNotice: currentVehicle, 
            vehiclesInScene: vehicles
        }
    }

    setInterval(tick, 1000);

    return {
        getTrackers,
        getTracker,
        updateTracker,
        tick,
        getCurrentState
    }
}

