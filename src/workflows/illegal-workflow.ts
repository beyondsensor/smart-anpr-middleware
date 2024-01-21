import { HikIsapiPluginConfig } from "../data/hikvision/cameras";
import { AdvantechDeviceSettings } from "../data/io-controller/io-controllers";
import appLogger from "../lib/logger";
import { AdamControllerPlugin } from "../plugins/advantech/adam-controller-plugin";
import { AlarmMessage, makeHikIsapiPlugin } from "../plugins/hikvision/hik-isapi-plugin";

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
const ioController: AdamControllerPlugin = new AdamControllerPlugin(adamConfig)

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

    }

    if (message.contentType === "image/jpeg") {

    }
}

const camera = makeHikIsapiPlugin(config);
camera.getAlertStream(handleAlarmMessage)
    .then(results => {
        appLogger.info ( `Successfully connected to Camera Alarm Stream` );
    }).catch(error => {

    })


