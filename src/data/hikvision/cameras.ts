
export type Protocol = "http" | "https"
export type AxiosClientType = "axios" | "axiosDigest"
export type BoundaryType = "MIME_boundary" | "7daf10c20d06";
export interface HikIsapiPluginConfig {
    id: string,
    name: string, 
    protocol: Protocol,
    host: string,
    user: string,
    password: string,
    boundary: BoundaryType, // This is to Simplify the Error, because we are leveraging on this field to seperate the Data Strea, 
    axiosInstanceType: AxiosClientType,
    imageOffset: number,
    dataOffset: number
}

export const cctvList : HikIsapiPluginConfig[]= [
    {
        id: "1",
        name: "ANPR-Camera-Testing-001", 
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
        id: "2",
        name: "Office Entrance FR Terminal", 
        protocol: "http",
        host: "192.168.0.101",
        user: "admin",
        password: "abcde12345",
        boundary: "MIME_boundary", 
        axiosInstanceType: "axiosDigest", 
        imageOffset: 2, 
        dataOffset: 4, 
    },
    
   
]