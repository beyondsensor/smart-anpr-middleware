import { AdvantechDeviceSettings, AdvantechMqClient } from "../lib/advantech/io-controller";

/// Settings for the MQ Client 
const deviceSettings : AdvantechDeviceSettings = {
    id: 1,
    name: "device_name",
    mqConfigs: {
        willTopic: "Advantech/74FE488684FD/Device_Status",
        statusTopic: "Advantech/74FE488684FD/data",
        triggerPrefix: "Advantech/74FE488684FD/ctl"
    },
    dis: ["di1", "di2", "di3", "di4", "di5", "di6"],
    dos: ["do1", "do2", "do3", "do4", "do5", "do6"],
};

/// Client Manager 
const client = new AdvantechMqClient ( deviceSettings );

function triggerAll ( value : boolean ) { 
    return deviceSettings.dos.map ( e => { 
        return client.trigger ( e, value );
    })
}

function trigger( doId : string, value : boolean ) { 
    return client.trigger ( doId, value );
}

function getStatus () { 
    return client.status;
}

function getState () { 
    return client.state;
}

function getConfig () { 
    return client.config;
}


export const ioService = { 
    trigger, 
    getStatus, 
    getConfig, 
    getState, 
    triggerAll
}

