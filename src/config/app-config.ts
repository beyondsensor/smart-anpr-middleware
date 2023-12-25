import dotenv from 'dotenv';
dotenv.config();

export const appConfig = { 
    port: 3001, 
    appName: process.env.APP_NAME || "My Middleware Service"
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

export const authConfig = { 
    authKey: process.env.API_AUTH_KEY || "some_api_key", 
}

export const backendConfig = { 
    host: process.env.BACKEND_HOST || "http://localhost:1337", 
    apiKey: process.env.BACKEND_API_KEY || "some-api-key"
}

export const trackerConfig = { 
    warningTime : 30000, 
    triggerTime : 60000
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
