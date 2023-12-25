import appLogger from "../logger";


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

    getElapsedTime() {
        return (this.lastUpdated - this.start);
    }

    getAnpr() { return this.anpr; }

    getImage () { return this.image; }
    
    getData() {
        return {
            anpr: this.anpr,
            //image: this.image, 
            start: new Date(this.start).toISOString(),
            lastUpdated: new Date(this.lastUpdated).toISOString(),
            dwellTime: this.lastUpdated - this.start,
            lastSeen: this.getLastSeen()
        }
    }
}

export function makeTracker(props: {
    onVehicleWarning: (tracker: VehicleTracker) => void
    onVehicleLeave: (tracker: VehicleTracker) => void
}) {
    const { onVehicleWarning, onVehicleLeave } = props;
    const trackers = new Map<string, VehicleTracker>();

    function getTrackers() {
        return Array.from(trackers.entries()).map(([key, instance]) => instance);
    }

    function getTracker(anpr: string) {
        let instance = trackers.get(anpr);
        if (instance === undefined) {
            instance = new VehicleTracker(anpr);
            trackers.set(anpr, instance);
        }
        return instance;
    }

    function updateTracker(anpr: string, image: string) {
        getTracker(anpr).update(image);
    }

    function tick() {
        appLogger.debug ( "Vehicletracker : tick");
        getTrackers().forEach(t => {

            // Check if the Vehicle is already Out 
            if (t.getLastSeen() > 5000 ) {
                onVehicleLeave(t);
                trackers.delete(t.getAnpr())
            } else {
                if (t.getElapsedTime() > 30000) {
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

