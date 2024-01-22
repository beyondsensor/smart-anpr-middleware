import { HikIsapiPluginConfig } from "../data/hikvision/cameras";
import { AdvantechDeviceSettings } from "../data/io-controller/io-controllers";
import { WebHookConfig } from "../data/web-hooks/event-web-hook";
import appLogger from "../lib/logger";
import { AdamControllerPlugin } from "../plugins/advantech/adam-controller-plugin";
import { AlarmMessage, makeHikIsapiPlugin } from "../plugins/hikvision/hik-isapi-plugin";
import { parseString } from "xml2js";
import { makeWebhook } from "../plugins/webhook/web-hook-plugin";
/// Wire Up the Advantech Device
const adamConfig: AdvantechDeviceSettings = {
    id: 0,
    name: "advantech-adam-6060",
    mqConfigs: {
        willTopic: "Advantech/74FE488684FD/Device_Status",
        statusTopic: "Advantech/74FE488684FD/data",
        triggerPrefix: "Advantech/74FE488684FD/ctl"
    },
    dis: ["di1", "di2", "di3", "di4", "di5", "di6"],
    dos: ["do1", "do2", "do3", "do4", "do5", "do6"],
}
//const ioController: AdamControllerPlugin = new AdamControllerPlugin(adamConfig)

/// Wire Up the Application Function 
const config: HikIsapiPluginConfig = {
    id: "1",
    name: "lpr-camera-001",
    protocol: "http",
    host: "192.168.0.103",
    user: "admin",
    password: "abcde12345",
    boundary: "7daf10c20d06",
    axiosInstanceType: "axios",
    imageOffset: 2,
    dataOffset: 4
}

function handleAlarmMessage(message: AlarmMessage) {
    /// TODO : Make Sense of the Hikvision Camera Data, so that we can track any vehicles... 
    appLogger.info("Incoming Message", message.contentLength);

    if (message.contentType === "application/json") {

    }

    if (message.contentType === "application/xml") {
        const xml = Buffer.from(message.messageData).toString()
        appLogger.info(`Incoming XML Message`);
        console.log(xml);
        parseString(xml, { explicitArray: false, preserveChildrenOrder: true }, (err, result) => {
            if (err) {
                console.log(err)
                return;
            }
            const { $, ipv6Address, ...event } = result.EventNotificationAlert;
            const parsedEvent = {
                ...event,
                portNo: parseInt(event.portNo),
                channelID: parseInt(event.channelID),
                activePostCount: parseInt(event.activePostCount),
            };
            onJsonWebHook.invoke(parsedEvent); 
            console.log(parsedEvent)
        })
    }

    if (message.contentType === "image/jpeg") {

    }
}

const camera = makeHikIsapiPlugin(config);
camera.getAlertStream(handleAlarmMessage)
    .then(results => {
        appLogger.info(`Successfully connected to Camera Alarm Stream`);
    }).catch(error => {

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
    
    
