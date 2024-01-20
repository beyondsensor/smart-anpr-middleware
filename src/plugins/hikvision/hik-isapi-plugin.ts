import AxiosDigest from 'axios-digest';
import { AlarmBuffer, AlarmBufferCallback } from './read-alarm-data';
import * as fs from "fs"
import axios, { Axios as AxiosInstance } from 'axios';

export interface HikIsapiPluginConfig {
    protocol: "http" | "https",
    host: string,
    user: string,
    password: string,
    boundary: "MIME_boundary" | "7daf10c20d06" | "MIME_boundary\n",
    axiosInstanceType: "axios" | "axiosDigest", 
    imageOffset: number, 
    dataOffset: number
}


const items = [
    "/ISAPI/Custom/SelfExt/ContentMgmt/ZeroStreaming/channels/",
    "/ISAPI/Event/notification/subscribeEvent",
    "/ISAPI/System/deviceInfo"
]


export class HikIsapiPlugin {

    private config: HikIsapiPluginConfig;
    private axiosInstance: AxiosDigest | AxiosInstance;
    private alarmBuffer: AlarmBuffer;

    constructor(config: HikIsapiPluginConfig) {
        this.alarmBuffer = new AlarmBuffer();
        this.config = config;
        this.axiosInstance = config.axiosInstanceType === "axiosDigest" ? new AxiosDigest(config.user, config.password) : axios.create({
            auth: { username: config.user, password: config.password }
        });
    }

    private onBufferMessage(m: Buffer, callback: AlarmBufferCallback) {
        console.log ( m.buffer.byteLength )
        const filePath = `${this.config.host}-output.text`;
        fs.appendFileSync(filePath, m);
        this.alarmBuffer.ParseAlarmData(m, this.config.boundary, this.config.imageOffset, this.config.dataOffset, callback);
    }

    async getDeviceInfo() {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/System/deviceInfo`;
        const response = await this.axiosInstance.get(apiUrl)
        return response.data;
    }

    async getCapabilities() {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/System/capabilities`;
        const response = await this.axiosInstance.get(apiUrl)
        return response.data;
    }

    async getSubcribeEventCap() {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/Event/notification/subscribeEventCap`;
        const response = await this.axiosInstance.get(apiUrl)
        return response.data;
    }

    async getSnapshot(channel: number) {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/Streaming/channels/${channel}/picture`;
        const response = await this.axiosInstance.get(apiUrl, { responseType: "arraybuffer" })
        return Buffer.from(response.data, "binary");
    }

    getAlertStream(callback: AlarmBufferCallback) {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/Event/notification/alertStream`;
        console.log ( `IP ${apiUrl}`)
        this.axiosInstance.get(apiUrl, {
            headers: {
                'Connection': "keep-alive"
            },
            responseType: "stream"
        }).then(response => {
            response.data.on("data", ((buffer: Buffer) => this.onBufferMessage(buffer, callback)));
        })
            .catch(error => {
                //console.log ( error );
                console.log("Axios Error")
            })
    }
}
