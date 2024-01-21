import AxiosDigest from 'axios-digest';
import * as fs from "fs"
import * as path from "path"
import axios, { Axios as AxiosInstance } from 'axios';
import { hikConfig, loggingConfig } from '../../config/app-config';
import appLogger from '../../lib/logger';
import { AxiosClientType, HikIsapiPluginConfig } from '../../data/hikvision/cameras';

export interface AlarmMessage {
    index: number;
    contentLength: number,
    contentType: "application/xml" | "application/json" | "image/jpeg" | "unknown",
    meta?: any,
    messageData: number[],
}

export function makeHikIsapiPlugin ( config : HikIsapiPluginConfig  ) { 
    return new HikIsapiPlugin ( config ); 
}

class HikIsapiPlugin {

    private config: HikIsapiPluginConfig;
    private axiosInstance: AxiosDigest | AxiosInstance;
    private alarmBuffer: EventAlarmBuffer;
    private isAlarmOn: boolean = false;

    constructor(config: HikIsapiPluginConfig) {
        this.alarmBuffer = new EventAlarmBuffer();
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

export type AlarmBufferCallback = (m: AlarmMessage) => void
export class EventAlarmBuffer {

    _buffer: Buffer = Buffer.from("");
    i = 0;

    constructor() {

    }

    ParseAlarmData(incomingData: Buffer, boundary: string, imageOffset: number, dataOffset: number, callback: AlarmBufferCallback) {

        console.log("Incoming Buffer", incomingData.length);
        /// Join the Buffer as a whole 
        this._buffer = Buffer.concat([this._buffer, incomingData]);
        //console.log("Buffer Length", _buffer.length);

        /// Get the Buffer from the List 
        const data: number[] = Array.from(this._buffer);

        // Convert string to byte array using TextEncoder
        const encoder = new TextEncoder();
        const resultByteArray: number[] = Array.from(encoder.encode("--" + boundary));
        let iNextBoundary = indexOf(data, 0, resultByteArray);
        let iLen = 0;

        /// Process the Incoming Message 
        while (iNextBoundary >= 0) {

            const currentIndex = iNextBoundary;
            iLen = iNextBoundary;

            // We need to know the next boundary, so that we can manage what to slice
            iNextBoundary = indexOf(data, iNextBoundary + ("--" + boundary).length, resultByteArray);
            if (iNextBoundary === -1) {
                break;
            }

            const dataBuffer = data.slice(currentIndex + resultByteArray.length, iNextBoundary);
            const contentLength = getContentLength(dataBuffer);
            const contentType = getContentType(dataBuffer) as "application/xml" | "application/json" | "image/jpeg" | "unknown";
            const meta = getOtherMeta(dataBuffer);
            const offset = contentType?.includes("image") ? imageOffset : dataOffset;
            const actualMessages = dataBuffer.slice(dataBuffer.length - contentLength - offset);

            callback({
                index: this.i,
                contentLength,
                contentType: contentType ? contentType : "unknown",
                meta,
                messageData: [...actualMessages]
            })
            this.i++;
        }

        this._buffer = Buffer.from(data.slice(iLen));
        console.log("Processing Buffer complete : ", iLen);
        console.log("Buffer left : ", this._buffer.length);
    }
}


function makeAxiosClient(type: AxiosClientType, user: string, password: string): AxiosDigest | AxiosInstance {
    return (type === "axiosDigest") ?
        new AxiosDigest(user, password) : axios.create({
            auth: { username: user, password: password }
        })
}


function getContentLength(dataBuffer: number[]) {
    const contentLengthMatch = Buffer.from(dataBuffer).toString().match(/Content-Length:\s*(\d+)/);
    if (contentLengthMatch) {
        const messageLength = parseInt(contentLengthMatch[1], 10);
        return messageLength;
    } else {
        return dataBuffer.length;
    }
}

function getContentType(dataBuffer: number[]) {
    // Extracting the Content-Type from the raw HTTP response
    const contentTypeMatch = Buffer.from(dataBuffer).toString().match(/Content-Type:\s*([^\s;]+)/);

    if (contentTypeMatch) {
        const contentType = contentTypeMatch[1];
        return contentType;
    } else {
        console.error("Content-Type header not found or invalid format.");
    }
}

function getOtherMeta(dataBuffer: number[]) {

    // Extracting 'name' and 'filename' attributes from the Content-Disposition header
    const nameMatch = Buffer.from(dataBuffer).toString().match(/name="([^"]+)"/);
    const filenameMatch = Buffer.from(dataBuffer).toString().match(/filename="([^"]+)"/);
    if (nameMatch && filenameMatch) {
        const name = nameMatch[1];
        const filename = filenameMatch[1];
        return {
            name,
            filename
        }
    } else {
        return undefined;
        console.error("Unable to extract 'name' or 'filename' from Content-Disposition header.");
    }
}

function indexOf(src: number[], index: number, value: number[]): number {
    if (!src || !value) {
        return -1;
    }

    if (src.length === 0 || src.length < index || value.length === 0 || src.length < value.length) {
        return -1;
    }

    for (let i = index; i < src.length - value.length; i++) {
        if (src[i] === value[0]) {
            if (value.length === 1) {
                return i;
            }

            let flag = true;
            for (let j = 1; j < value.length; j++) {
                if (src[i + j] !== value[j]) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                return i;
            }
        }
    }

    return -1;
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


