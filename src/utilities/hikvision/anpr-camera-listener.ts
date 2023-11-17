
export interface HikCameraConfig { 
    host : string; 
    user : string; 
    password : string; 
}


export function makeAnprCameraListener ( config : HikCameraConfig ) { 

    const service = { 

        config : config,

        connnect : () => { 
            //TODO : Connect to the Camera Stream and Listens for any ANPR Camera Feed 
        },

        disconnect : () => { 

        },

        onMessage : ( message : string ) => { 

        }, 

        processMessage : ( message : string ) => { 

        }
    }

    return service;
}