interface WebHookConfig { 
    url: string;
    method: "POST" | "GET" | "PUT" | "DELETE";
    headers: any;
}

const webHooks : WebHookConfig[] = [

]
