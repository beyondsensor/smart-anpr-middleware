export interface AdvantechDeviceSettings {
    id: number,
    name: string;
    mqConfigs: {
      willTopic: string;
      statusTopic: string;
      triggerPrefix: string;
    },
    dis: string[];
    dos: string[];
  };

  
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