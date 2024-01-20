import AxiosDigest from 'axios-digest';
import { AlarmBuffer, AlarmBufferCallback } from './read-alarm-data';
import * as fs from "fs"
import * as path from "path"
import axios, { Axios as AxiosInstance } from 'axios';
import { hikConfig, loggingConfig } from '../../config/app-config';
import appLogger from '../../lib/logger';
import { AxiosClientType, HikIsapiPluginConfig } from '../../data/cameras';

export class HikIsapiPlugin {

    private config: HikIsapiPluginConfig;
    private axiosInstance: AxiosDigest | AxiosInstance;
    private alarmBuffer: AlarmBuffer;
    private isAlarmOn: boolean = false;

    constructor(config: HikIsapiPluginConfig) {
        this.alarmBuffer = new AlarmBuffer();
        this.config = config;
        this.axiosInstance = makeAxiosClient(config.axiosInstanceType, config.user, config.password);
    }

    private info(message: string) {
        appLogger.info(`[ISAPI] ${this.config.host} ${message}`)
    }

    private onBufferMessage(m: Buffer, callback: AlarmBufferCallback) {
        if (loggingConfig.level === "debug") {
            const streamDebuggingPath = ` ${hikConfig.loggingPath}/${this.config.id}-${this.config.host}-alarm.stream`;
            const filePath = `${this.config.host}-output.text`;
            const target = path.resolve(streamDebuggingPath, filePath);
            fs.appendFileSync(target, m);
        }
        console.log(m.buffer.byteLength)
        this.alarmBuffer.ParseAlarmData(m, this.config.boundary, this.config.imageOffset, this.config.dataOffset, callback);
    }

    async getDeviceInfo() {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/System/deviceInfo`;
        const response = await this.axiosInstance.get(apiUrl)
        this.info(`getDeviceInfo`);
        return response.data;
    }

    async getCapabilities() {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/System/capabilities`;
        const response = await this.axiosInstance.get(apiUrl)
        this.info(`getCapabilities`);
        return response.data;
    }

    async getSubcribeEventCap() {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/Event/notification/subscribeEventCap`;
        const response = await this.axiosInstance.get(apiUrl)
        this.info(`getSubcribeEventCap`);
        return response.data;
    }

    async getSnapshot(channel: number) {
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/Streaming/channels/${channel}/picture`;
        const response = await this.axiosInstance.get(apiUrl, { responseType: "arraybuffer" })
        this.info(`getSnapshot`);
        return Buffer.from(response.data, "binary");
    }

    async getAlertStream(callback: AlarmBufferCallback) {
        if (this.isAlarmOn) {
            appLogger.error(`[ISAPI] ${this.config.host} Alarm already armed..`)
        }
        const apiUrl = `${this.config.protocol}://${this.config.host}/ISAPI/Event/notification/alertStream`;
        console.log(`IP ${apiUrl}`)
        this.axiosInstance.get(apiUrl, {
            headers: {
                'Connection': "keep-alive"
            },
            responseType: "stream"
        }).then(response => {
            this.isAlarmOn = true;
            response.data.on("data", ((buffer: Buffer) => {
                if (loggingConfig.level === "debug") {

                }
                this.onBufferMessage(buffer, callback)
            }));
        })
            .catch(error => {
                //console.log ( error );
                console.log("Axios Error")
            })
    }
}

function makeAxiosClient(type: AxiosClientType, user: string, password: string): AxiosDigest | AxiosInstance {
    return (type === "axiosDigest") ?
        new AxiosDigest(user, password) : axios.create({
            auth: { username: user, password: password }
        })
}


function ensureDirectoryExists(directoryPath: string): void {
    // Check if the directory exists
    if (!fs.existsSync(directoryPath)) {
        // If it doesn't exist, create it recursively
        fs.mkdirSync(directoryPath, { recursive: true });
        appLogger.info(`[HikCameraPlugin] Directory created: ${directoryPath}`);
    } else {
        appLogger.info(`[HikCameraPlugin] Directory already exists: ${directoryPath}`);
    }
}
ensureDirectoryExists(hikConfig.imageDir);
ensureDirectoryExists(hikConfig.loggingPath);
