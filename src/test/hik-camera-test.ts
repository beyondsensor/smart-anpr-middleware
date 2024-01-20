import { AlarmBufferCallback, HikIsapiPlugin } from "../plugins/hikvision/hik-isapi-plugin";
import * as fs from "fs";
import { cctvList as configuredCameras } from "../data/hikvision/cameras";

const callback: AlarmBufferCallback = (m) => {
    console.log(`Index Sequence : [${m.index}] [Content Type: ${m.contentType}] [Declared Length: ${m.contentLength}] [Actual Data Length: ${m.messageData.length}]`)

    /// We know that the Message is JSON
    if (m.contentType === "application/json") {
        try {
            const object = JSON.parse(Buffer.from(m.messageData).toString());
            //console.log(object)
        } catch (exception) {
            console.log(Buffer.from(m.messageData).toString())
            console.error(exception);
        }
    }

    if (m.contentType === "image/jpeg") {
        const filePath = `snapshot-${m.index}.jpeg`
        fs.writeFileSync(filePath, Buffer.from(m.messageData))
    }
}

const plugin = new HikIsapiPlugin(configuredCameras[2]);



plugin.getAlertStream(callback);
    