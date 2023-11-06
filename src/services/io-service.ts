import { mqttConfig } from "../config/app-config";
import { IOTriggerRequest } from "../types/io-types" 
import { ConnectionParams, MyMqttClient, makeMqttClient } from "../utilities/mqtt";
import appLogger from "../utilities/logger";
const connectionParams : ConnectionParams = {
    mqttHost: mqttConfig.mqServerHost,
    mqttUser: mqttConfig.mqUser,
    clientId: "middleware-001",
    mqttPassword: mqttConfig.mqPassword,
    topic: mqttConfig.topic,

    onConnect: function (): void {
        appLogger.info ( "Connection established");

    },
    onMessage: function (topic: string, message: Buffer): void {
        try { 
            const start = Date.now();
            const results = message.toString();
            const object = JSON.parse ( results );
            const end = Date.now();
            /// Process The Message from here 
            appLogger.info ( `Received Message for Topic : ${topic} [${results.length} bytes] [Time taken : ${end - start} ms]`)
        } catch ( error : any) { 
            appLogger.error ( ` Unable to process message : ${error.message}`)
        }
    },
    onError: function (error: any): void {
        appLogger.error ( `Lost connection with MQ Server`)
    },
    onClose: function (): void {
        appLogger.error ( `Lost connection with MQ Server`)
    }
}
const client : MyMqttClient = makeMqttClient ( connectionParams );

export async function getStatus () { 
    return { 
        mqConnection : true
    }
}

export async function sendMessage (  message : string ) { 
    client.sendMessage ( message );
    return { 
        message : message
    }
}

export async function triggerIOSignal ( { ioPort, bit } : IOTriggerRequest) { 
    const message = JSON.stringify ( { 
        bit: bit,
        port: ioPort
    })
    client.sendMessage ( message );
    return { 
        success: true     
    }
}

