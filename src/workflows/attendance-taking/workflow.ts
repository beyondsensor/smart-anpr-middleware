
/*************************
 * 
 * 
 * 1. Listen for any incoming message from HikVision's FR Terminal 
 * 2. Connect to ISAPI Alarm Event 
 * 3. Filter the Messages, and then parse it to another System, via Webhook configured. 
 */

import appLogger from "../../lib/logger";
import { AlarmMessage } from "../../plugins/hikvision/hik-isapi-plugin";
import { onImageWebHook, onJsonWebHook, plugin } from "./config";
const { info, debug } = appLogger;

const _currentEvent : any = undefined; 

function onAlertMessage ( message : AlarmMessage ) { 
    
    info ( `Incoming message from Camera : [${message.contentLength}] [${message.contentType}]`);

    if ( message.contentType === "application/json" ) {
        const body = JSON.parse ( Buffer.from ( message.messageData ).toString() ); 
        onJsonWebHook.invoke ( body );
    }

    if ( message.contentType === "application/xml") { 

    }

    if ( message.contentType === "image/jpeg" ) { 
        const formData = new FormData(); 
        formData.append( "snapshot", new Blob([new Uint8Array(message.messageData)]));
        formData.set("event", JSON.stringify(_currentEvent));
        onImageWebHook.invoke ( formData );
    }
}
plugin.getAlertStream ( onAlertMessage )
.then ( () => { 
    info ( "Successfully armed Backend");
})
.catch ( error => { 
    error ( `Failed to connect to Backend`);
    debug ( `[Error]`, error );
})
