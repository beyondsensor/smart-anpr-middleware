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
    topic : string;
    onConnect : OnConnectCallback;
    onMessage : OnMessageCallback;
    onError : OnErrorCallback;
    onClose : OnCloseCallback;
}

export interface MyMqttClient { 
    client : mqtt.MqttClient;
    sendMessage : ( message : string ) => void; 
}

export function makeMqttClient ( connection : ConnectionParams ) : MyMqttClient { 

    ///Establish a Client
    const client = mqtt.connect(connection.mqttHost, {
                                clientId: connection.clientId,
                                username: connection.mqttUser, 
                                password: connection.mqttPassword,
    });
    client.subscribe ( connection.topic );

    // Handle connection events
    client.on('connect', connection.onConnect);
    client.on('message', connection.onMessage);
    client.on('error', connection.onError);
    client.on("disconnect", connection.onClose);

    return { 
        client : client,
        sendMessage: ( message : string ) => { 
            appLogger.info ( "Sending Message via Client");
            appLogger.info ( `Sending Message to Topic : ${message}`);
            client.publish( connection.topic, message );
            return { 
                success: true
            }
        }
    }
}

