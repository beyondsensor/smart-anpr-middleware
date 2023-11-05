
export interface VehicleEnterEvent { 
    cameraId: string;
    anpr : string; 
    snapshotInBase64: string
}

export interface VehicleLeaveEvent {
    cameraId: string;
    anpr : string; 
    snapshotInBase64: string
}

export interface VehicleTracker { 
    anpr : string; 
    snapshot : string;
    warningTimeout : NodeJS.Timeout;
    triggerTimeout : NodeJS.Timeout;
    stop : () => void; 
}