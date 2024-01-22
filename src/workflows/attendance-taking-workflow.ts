import { HikIsapiPluginConfig } from "../data/hikvision/cameras";
import { WebHookConfig } from "../data/web-hooks/event-web-hook";
import appLogger from "../lib/logger";
import { AlarmMessage, makeHikIsapiPlugin } from "../plugins/hikvision/hik-isapi-plugin";
import { makeWebhook } from "../plugins/webhook/web-hook-plugin";




/*************************
 * 
 * 
 * 1. Listen for any incoming message from HikVision's FR Terminal 
 * 2. Connect to ISAPI Alarm Event 
 * 3. Filter the Messages, and then parse it to another System, via Webhook configured. 
 */


const cameraConfig : HikIsapiPluginConfig = {
    id: "2",
    name: "Office Entrance FR Terminal", 
    protocol: "http",
    host: "192.168.0.101",
    user: "admin",
    password: "abcde12345",
    boundary: "MIME_boundary", 
    axiosInstanceType: "axiosDigest", 
    imageOffset: 2, 
    dataOffset: 4, 
}

const plugin = makeHikIsapiPlugin( cameraConfig );
function onAlertMessage ( message : AlarmMessage ) { 
    
    appLogger.info ( `Incoming message from Camera : [${message.contentLength}] [${message.contentType}]`);

    if ( message.contentType === "application/json" ) {
        const body = JSON.parse ( Buffer.from ( message.messageData ).toString() ); 
        onJsonWebHook.invoke ( body );
    }

    if ( message.contentType === "application/xml") { 

    }

    if ( message.contentType === "image/jpeg" ) { 
        const formData = new FormData(); 
        formData.append( "image", new Blob([new Uint8Array(message.messageData)]));
        onImageWebHook.invoke ( formData );
    }
}
plugin.getAlertStream ( onAlertMessage )
.then ( () => { 
    appLogger.info ( "Successfully armed Backend");
})
.catch ( error => { 
    appLogger.error ( `Failed to connect to Backend`);
    appLogger.debug ( `[Error]`, error );
})

const onJsonWebhook : WebHookConfig = {
    id: "1",
    name: "OnJsonEvent",
    url: "http://localhost:3001/api/workflows/attendance-taking/on-json-event",
    method: "POST",
    headers: {
        "Authorizaition": "some-authorization-key", 
        'Content-Type': 'application/json'
    }
}
const onImageWebhook : WebHookConfig = {
    id: "1",
    name: "OnImageEvent",
    url: "http://localhost:3001/api/workflows/attendance-taking/on-image",
    method: "POST",
    headers: {
        "Authorizaition": "some-authorization-key", 
        'Content-Type': 'multipart/form-data'
    }
}
const onJsonWebHook = makeWebhook ( onJsonWebhook );
const onImageWebHook = makeWebhook ( onImageWebhook)

