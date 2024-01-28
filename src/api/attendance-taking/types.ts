import z from "zod"; 

export const CreateFacialEventSchema = z.object( { 
    ipAddress: z.string().ip().default(""), 
    eventType: z.number(),
    label: z.string().default(""), 
    doorNo: z.number().default(-1), 
    helmet: z.string(), 
    serialNo: z.number().default(-1), 
    deviceName: z.string().default(""), 
    cardReaderKind: z.string().default(""), 
    attendanceStatus: z.string().default(""), 
    currentVerificationMode: z.string().default(""), 
    faceRect: z.string()
}); 
