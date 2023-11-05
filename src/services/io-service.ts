import { mqttConfig } from "../config/app-config";
import { IOTriggerRequest } from "../types/io-types" 
import { ConnectionParams, MyMqttClient, makeMqttClient } from "../utilities/mqtt";

const connectionParams : ConnectionParams = {
    mqttHost: mqttConfig.mqServerHost,
    mqttUser: mqttConfig.mqUser,
    clientId: "middleware-001",
    mqttPassword: mqttConfig.mqPassword,
    topic: mqttConfig.topic,

    onConnect: function (): void {
        console.log ( "Connection established")
    },
    onMessage: function (topic: string, message: Buffer): void {
        try { 
            const start = Date.now();
            console.log ( `Received Message from the following topic : ${topic}`)
            const results = message.toString();
            const object = JSON.parse ( results );
            const end = Date.now();
            console.log ( "Message Received", topic, object );
            console.log ( `Time taken : [${end - start } ms]`)
        } catch ( error ) { 
            console.log ( error )
        }
    },
    onError: function (error: any): void {
        console.log ( "Connection error");
        //console.log ( "Error ", error )
    },
    onClose: function (): void {
        console.log ( "Connection Closed");
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

