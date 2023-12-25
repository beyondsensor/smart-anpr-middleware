
export interface CameraConfig { 
    host : string; 
    user : string; 
    password : string;
    onData : ( message : any ) => void; 
}

export function makeAnprCameraListener ( config : CameraConfig ) { 

    const service = { 
        config : config,
    }

    return service;
}