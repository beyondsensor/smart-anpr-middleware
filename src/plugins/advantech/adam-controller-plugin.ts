import { mqttConfig } from "../../config/app-config";
import { AdvantechDeviceSettings } from "../../data/io-controller/io-controllers";
import appLogger from "../../lib/logger";
import { MyMqttClient, makeMqttClient } from "../../lib/mqtt";

export class AdamControllerPlugin {

  config: AdvantechDeviceSettings;
  status: any ={};
  state: any = {};
  private client: MyMqttClient;

  constructor(config: AdvantechDeviceSettings) {
    this.config = config;
    this.client = makeMqttClient({
      mqttHost: mqttConfig.mqServerHost,
      mqttUser: mqttConfig.mqUser,
      mqttPassword: mqttConfig.mqPassword,
      clientId: "middleware-service",
      onConnect: this.onConnect.bind(this),
      onMessage: this.onMessage.bind(this),
      onError: this.onError.bind(this),
      onClose: this.onClose.bind(this),
    });
    this.client.subscribeToTopic(this.config.mqConfigs.willTopic);
    this.client.subscribeToTopic(this.config.mqConfigs.statusTopic);
  }

  onConnect() {
    appLogger.info("Successfully connected to MQ Server");
  }

  onMessage(topic: string, message: Buffer) {
    appLogger.info(`Received message from MQ [${topic}] [${message.length} bytes]`);

    switch ( topic ) { 
      case this.config.mqConfigs.willTopic : { 
        appLogger.debug ( "Processing Will Topic..." )
        this.status = JSON.parse ( message.toString());
        //TODO : Write to Database
        break;
      }
      case this.config.mqConfigs.statusTopic : { 
        appLogger.debug ( "Processing Device Status..." )
        this.state = JSON.parse ( message.toString());
        //TODO : Write to Database
        break;
      }
    }
    appLogger.debug (  message.toString());
  }

  onError() {
    appLogger.error("Lost connectiont to MQ Server");
  }

  onClose() {
    appLogger.info("Connection Closed");
  }

  trigger(doName: string, flag: boolean) {
    if (this.config.dos.includes(doName)) {
      appLogger.info(
        `Sending message to trigger IO Controller Output : ${doName} to ${flag}`
      );
      const topic = `${this.config.mqConfigs.triggerPrefix}/${doName}`;
      const message = {
        v: flag,
      }
      this.client.sendMessage(topic, JSON.stringify(message));

    } else {
      appLogger.error(`Invalid IO Port Controller`);
    }

    return {
      message: "success"
    }
  }

}
