import { cctvList } from "../data/cameras";
import { HikIsapiPlugin } from "../plugins/hikvision/hik-isapi-plugin";

const cctvs = cctvList.map(config => {
    return {
        id: config.id,
        config: { ...config },
        isapiPlugin: new HikIsapiPlugin(config)
    }
})

export async function getCctvList() {
    const promises = cctvs.map(async (e) => {
        return new Promise(async (resolve, reject) => {
            try {
                const deviceInfo = await e.isapiPlugin.getDeviceInfo();
                const capabilities = await e.isapiPlugin.getCapabilities();
                resolve({
                    config: { ...e.config },
                    deviceInfo,
                    capabilities,
                });
            } catch (error) {
                reject(error);
            }
        });
    });

    try {
        const response = await Promise.all(promises);
        return response;
    } catch (error) {
        // Handle error from any of the promises
        console.error("An error occurred:", error);
        throw error; // You might want to throw the error or handle it as needed
    }
}

export async function findById(id: string) {
    const res = cctvList.find(c => c.id === id);
    if (res) return res;
    throw new Error("Unable to find camera");
}

export async function getDeviceInfo(id: string) {
    const res = cctvs.find(c => c.id === id);
    if (res) {
        const response = await res.isapiPlugin.getDeviceInfo();
        return response;
    }
    throw new Error("Unable to find camera");
}

