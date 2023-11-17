import * as mqtt from 'mqtt'; // Import the MQTT library
import appLogger from './logger';
type OnConnectCallback = ( ) => void;
type OnCloseCallback = ( ) => void;
type OnMessageCallback = ( topic: string, message : Buffer ) => void;
type OnErrorCallback = ( error : any ) => void;

export interface ConnectionParams { 
    mqttHost : string; 
    mqttUser : string; 
    clientId : string;
    mqttPassword : string; 
    onConnect : OnConnectCallback;
    onMessage : OnMessageCallback;
    onError : OnErrorCallback;
    onClose : OnCloseCallback;
}

export interface MyMqttClient { 
    client : mqtt.MqttClient;
    sendMessage : ( topic : string, message : string ) => void; 
    subscribeToTopic : ( topic : string ) => void;
}

export function makeMqttClient ( connection : ConnectionParams ) : MyMqttClient { 

    ///Establish a Client
    const client = mqtt.connect(connection.mqttHost, {
                                clientId: connection.clientId,
                                username: connection.mqttUser, 
                                password: connection.mqttPassword,
    });

    // Handle connection events
    client.on('connect', connection.onConnect);
    client.on('message', connection.onMessage);
    client.on('error', connection.onError);
    client.on("disconnect", connection.onClose);

    return { 
        client : client,
        sendMessage: ( topic: string, message : string ) => { 
            appLogger.info ( "Sending Message via Client");
            appLogger.info ( `Sending Message to Topic : ${message}`);
            client.publish( topic, message );
            return { 
                success: true
            }
        },
        subscribeToTopic: ( topic : string ) => { 
            client.subscribe ( topic);
        }
    }
}

