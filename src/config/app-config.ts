import dotenv from 'dotenv';
dotenv.config();

export const hikConfig = { 
    maxBufferSize: process.env.HIK_MAX_ALARM_BUFFER || "5mb", 
    loggingPath: process.env.HIK_LOGGING_PATH || "debug/", 
    imageDir: process.env.HIK_ALARM_IMAGES_PATH || "data/alarms/images"
}

export const appConfig = { 
    port: 3001, 
    appName: process.env.APP_NAME || "My Middleware Service",
    authKey: process.env.APP_AUTH_KEY || "some_api_key", 
    jsonBodyLimit: process.env.APP_JSON_BODY_LIMIT || "5mb"
}

export const mqttConfig = { 
    mqServerHost: process.env.MQ_SERVER_HOST || "mqtt://localhost:1887",
    mqUser: process.env.MQ_SERVER_USER || "user",
    mqPassword: process.env.MQ_SERVER_PASSWORD || "password", 
    devices: process.env.IO_DEVICES||"10.0.0.1",
    topic: process.env.MQ_IO_TOPIC|| "some-sample-topic",
    topics: { 
        getStatus: "", 
        setStatus: "", 
        getIOAnalogData: "", 
        getAnalogInputRange: "", 
        setAnalogInputRange: "", 
        getAnalogOutputData: "",
        setAnalogOutputData: "",
        setAnalogOutputRange: "",
        willTopic: "", 
    }
}

export const backendConfig = { 
    host: process.env.BACKEND_HOST || "http://localhost:1337", 
    apiKey: process.env.BACKEND_API_KEY || "some-api-key"
}

export const loggingConfig = { 
    maxSize: "10MB", 
    maxFiles: 5, 
    level : process.env.LOGGING_LEVEL || "info", 
    filePath : "./logs",
    zippedArchive: false,
    fileName : "middleware-service_%DATE%.log", 
    dateFormat: "YYYY-MM-DDTHH:mm:ssZ"
}

export const vehicleTrackingConfig = { 
    expiryTime: parseInt(process.env.VEHICLE_EXPIRY??"") || 5000, 
    warningTime: parseInt(process.env.VEHICLE_TIME_TO_WARNING??"") || 30000, 
    alertTime: parseInt(process.env.VEHICLE_TIME_TO_ALERT??"") || 60000, 
    eventTopic: process.env.VEHICLE_EVENT_TOPIC || "beyondsensor/anpr/traffic", 
}
