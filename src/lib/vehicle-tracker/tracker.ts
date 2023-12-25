import appLogger from "../logger";
import { vehicleTrackingConfig } from "../../config/app-config";


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
        return  Date.now() - this.lastUpdated;
    }

    getDwelltime() {
        return (this.lastUpdated - this.start);
    }

    getAnpr() { return this.anpr; }

    getImage () { return this.image; }
    
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
    onVehicleEnter: (tracker: VehicleTracker) => void
    onVehicleWarning: (tracker: VehicleTracker) => void
    onVehicleLeave: (tracker: VehicleTracker) => void
}) {
    
    const { onVehicleWarning, onVehicleLeave, onVehicleEnter } = props;
    const trackers = new Map<string, VehicleTracker>();

    function getTrackers() {
        return Array.from(trackers.entries()).map(([key, instance]) => instance);
    }

    function getTracker(anpr: string, image: string ) {
        let instance = trackers.get(anpr);
        if (instance === undefined) {
            appLogger.info ( `New vehicle enter scene: [ ${anpr} ]`)
            instance = new VehicleTracker(anpr);
            trackers.set(anpr, instance);
            instance.update ( image );
            onVehicleEnter ( instance );
        } 
        return instance;
    }

    function updateTracker(anpr: string, image: string) {
        getTracker(anpr, image ).update(image);
    }

    function tick() {
        appLogger.debug ( "Vehicletracker : tick");
        getTrackers().forEach(t => {

            // Check if the Vehicle is already Out 
            if (t.getLastSeen() > vehicleTrackingConfig.expiryTime ) {
                onVehicleLeave(t);
                trackers.delete(t.getAnpr())
            } else {
                if (t.getDwelltime() > vehicleTrackingConfig.warningTime ) {
                    onVehicleWarning(t);
                }
            }
        })
    }

    setInterval ( tick, 1000 );
    
    return {
        getTrackers,
        getTracker,
        updateTracker,
        tick
    }
}

