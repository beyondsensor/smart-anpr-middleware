import { RawAxiosRequestHeaders } from "axios";

export interface WebHookConfig {
    id: string;  
    name: string;
    url: string;
    method: "POST" | "GET" | "PUT" | "DELETE";
    headers: RawAxiosRequestHeaders;
}

const webHooks : WebHookConfig[] = [

]
