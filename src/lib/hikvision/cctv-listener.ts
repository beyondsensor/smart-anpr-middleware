
export interface CameraConfig { 
    host : string; 
    user : string; 
    password : string;
    onData : ( message : CCTVEvent ) => void; 
}

export interface CCTVEvent { 
    type: "VIDEO" | "CROSS_LINE" | "VEHICLE" | "FACIAL" | "OTHERS", 
    subType: string,
    snapshot: string;
    meta: Map<string, string> 
}

export function makeCameraListener ( config : CameraConfig ) { 
    
    /// Get the Callback 
    const { onData } = config;

    const service = { 
        config : config,
        reset: () => { }
    }

    //TODO : Use Axios to Connect to Event Stream
    //Filter based on the Message Type and determine the next step actions needed to be performed. 

    return service;
}