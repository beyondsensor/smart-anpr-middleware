import z from "zod"; 

export const AccessControllerEventSchema = z.object({
    deviceName: z.string(),
    majorEventType: z.number(),
    subEventType: z.number(),
    name: z.string().optional().default(""),
    cardReaderKind: z.number().default(-1),
    cardReaderNo: z.number().default(-1),
    doorNo: z.number().default(-1),
    verifyNo: z.number().optional(),
    employeeNoString: z.string().optional().default(""),
    serialNo: z.number().optional(),
    userType: z.string().optional(),
    currentVerifyMode: z.string().optional(),
    currentEvent: z.boolean().optional(),
    frontSerialNo: z.number().optional(),
    attendanceStatus: z.string().nullable().optional(),
    label: z.string().optional(),
    statusValue: z.number().optional(),
    mask: z.string().optional(),
    helmet: z.string().optional(),
    picturesNumber: z.number().optional(),
    purePwdVerifyEnable: z.boolean().optional(),
    FaceRect: z.object({
        height: z.number(),
        width: z.number(),
        x: z.number(),
        y: z.number(),
    }).optional(),
});

export const EventSchema = z.object({
    ipAddress: z.string(),
    portNo: z.number(),
    protocol: z.string(),
    macAddress: z.string(),
    channelID: z.number(),
    dateTime: z.string(),
    activePostCount: z.number(),
    eventType: z.string(),
    eventState: z.string(),
    eventDescription: z.string(),
    AccessControllerEvent: AccessControllerEventSchema,
});


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