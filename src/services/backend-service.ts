import axios from "axios"
import { backendConfig } from "../config/app-config";
export async function getApplicationSettings () { 
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${backendConfig.host}/api/application-setting`,
        headers: { 
          'Authorization': `Bearer ${backendConfig.apiKey}`
        }
      };
      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
        return response.data.data.attributes.middlewareSettings;
      } catch ( error ) { 
        console.log ( error );
        throw error;
      }
}