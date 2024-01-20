import { HikIsapiPluginConfig } from "../plugins/hikvision/hik-isapi-plugin";

export const configuredCameras : HikIsapiPluginConfig[]= [
    {
        protocol: "http",
        host: "192.168.0.103",
        user: "admin",
        password: "abcde12345",
        boundary: "7daf10c20d06", 
        axiosInstanceType: "axios",
        imageOffset: 2, 
        dataOffset: 4, 
    },
    {
        protocol: "http",
        host: "192.168.0.101",
        user: "admin",
        password: "abcde12345",
        boundary: "MIME_boundary", 
        axiosInstanceType: "axiosDigest", 
        imageOffset: 2, 
        dataOffset: 4, 
    },
    
    {
        protocol: "http",
        host: "192.168.0.124",
        user: "admin",
        password: "Admin888",
        boundary: "MIME_boundary", 
        axiosInstanceType: "axiosDigest",
        imageOffset: 0, 
        dataOffset: 4, 
    }, 
]