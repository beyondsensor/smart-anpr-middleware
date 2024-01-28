
/*************************
 * 
 * 
 * 1. Listen for any incoming message from HikVision's FR Terminal 
 * 2. Connect to ISAPI Alarm Event 
 * 3. Filter the Messages, and then parse it to another System, via Webhook configured. 
 */

import appLogger from "../../lib/logger";
import { AlarmMessage } from "../../plugins/hikvision/hik-isapi-plugin";
import { onImageWebHook, plugin } from "./config";
const { info, debug, error } = appLogger;

let _currentEvent: any = undefined;

function onAlertMessage(message: AlarmMessage) {

    info(`Incoming message from Camera : [${message.contentLength}] [${message.contentType}]`);

    if (message.contentType === "application/json") {
        const jsonString = Buffer.from(message.messageData).toString(); 
        try { 
            info ( `Receiving JSON event from Alarm Stream`);
            _currentEvent = JSON.parse(jsonString); 
            debug(`Event Json: ${jsonString}`);
        } catch ( exception ) { 
            error ( "Unable to parse Event into JSON");
            debug ( `EventJson : ${jsonString}`)
        }
    }

    if (message.contentType === "application/xml") {

    }

    if (message.contentType === "image/jpeg") {
        info(`Receiving image, binding with previous event`);
        if (_currentEvent === undefined) {
            error(`There is no previous Event picked up`)
        } else {
            debug(`Event Json: ${JSON.stringify(_currentEvent)}`)
            const formData = new FormData();
            formData.append("snapshot", new Blob([new Uint8Array(message.messageData)]));
            formData.set("event", JSON.stringify(_currentEvent));
            onImageWebHook.invoke(formData);
            _currentEvent = undefined; 
        }
    }
}

plugin.getAlertStream(onAlertMessage)
    .then(() => {
        info("Successfully armed Backend");
    })
    .catch(error => {
        error(`Failed to connect to Backend`);
        debug(`[Error]`, error);
    })
