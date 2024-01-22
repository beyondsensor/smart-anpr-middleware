import axios, { Axios } from "axios";
import appLogger from "../../lib/logger";
import { WebHookConfig } from "../../data/web-hooks/event-web-hook";

export function makeWebhook(config: WebHookConfig) {
    return new WebhookPlugin(config);
}

class WebhookPlugin {

    config: WebHookConfig;

    constructor(config: WebHookConfig) {
        this.config = { ...config };
    }

    async invoke(body: any) {
        try {
            const response = await axios.request({
                url: this.config.url,
                method: this.config.method,
                headers: this.config.headers,
                data: body
            });
            appLogger.info(response);
        } catch ( error ) { 
            appLogger.error( error );
            console.log ( error )
        }
    }
}