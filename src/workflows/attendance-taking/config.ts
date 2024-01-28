import { HikIsapiPluginConfig } from "../../data/hikvision/cameras";
import { WebHookConfig } from "../../data/web-hooks/event-web-hook";
import { makeHikIsapiPlugin } from "../../plugins/hikvision/hik-isapi-plugin";
import { makeWebhook } from "../../plugins/webhook/web-hook-plugin";

export const cameraConfig : HikIsapiPluginConfig = {
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

export const onJsonWebhook : WebHookConfig = {
    id: "1",
    name: "OnJsonEvent",
    url: "http://localhost:3001/api/workflows/attendance-taking/on-json-event",
    method: "POST",
    headers: {
        "Authorizaition": "some-authorization-key", 
        'Content-Type': 'application/json'
    }
}

export const onImageWebhook : WebHookConfig = {
    id: "1",
    name: "OnJsonEvent",
    url: "http://localhost:3001/api/workflows/attendance-taking/on-image",
    method: "POST",
    headers: {
        "Authorizaition": "some-authorization-key", 
        'Content-Type': 'multipart/form-data'
    }
}

export const plugin = makeHikIsapiPlugin( cameraConfig );
export const onJsonWebHook = makeWebhook ( onJsonWebhook );
export const onImageWebHook = makeWebhook ( onImageWebhook)

