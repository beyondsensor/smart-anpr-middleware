import express, { Request, Response, request, response } from "express"
import fs from "fs";
import { z } from 'zod';
import upload from "../lib/multer";
import appLogger from "../lib/logger";
const loggingConfig = {
    dir: "data/alarams",
}

/**
 *     deviceName: 'Main Door',
    majorEventType: 3,
    subEventType: 1029,
    verifyNo: 242,
    serialNo: 11251,
    currentVerifyMode: 'invalid',
    currentEvent: true,
    frontSerialNo: 11250,
    attendanceStatus: 'undefined',
    label: '',
    statusValue: 0,
    mask: 'unknown',
    helmet: 'unknown',
    purePwdVerifyEnable: true
 */
const AccessControllerEventSchema = z.object({
    deviceName: z.string(),
    majorEventType: z.number(),
    subEventType: z.number(),
    cardReaderKind: z.number(),
    doorNo: z.number(),
    serialNo: z.number(),
    currentVerifyMode: z.string(),
    currentEvent: z.boolean(),
    frontSerialNo: z.number(),
    attendanceStatus: z.string().optional().default(""),
    label: z.string(),
    statusValue: z.number(),
    mask: z.string(),
    helmet: z.string(),
    purePwdVerifyEnable: z.boolean(),
});

const EventSchema = z.object({
    ipAddress: z.string(),
    portNo: z.number(),
    protocol: z.string(),
    macAddress: z.string(),
    channelID: z.number(),
    dateTime: z.string(), // You might want to use z.date() if you want to enforce a Date type
    activePostCount: z.number(),
    eventType: z.string(),
    eventState: z.string(),
    eventDescription: z.string(),
    channelName: z.string().optional(), 
    AccessControllerEvent: AccessControllerEventSchema.optional()
});


type GeneralEvent = z.infer<typeof EventSchema>;
type AccessControllerEvent = z.infer<typeof AccessControllerEventSchema>

const attendanceWorkflowRouter = express.Router();

function processAccessControllerEvent(event: GeneralEvent) {
    const alarmDetails = event.AccessControllerEvent;
    if (alarmDetails) {
        console.log(alarmDetails);
    } else {
        appLogger.error(`Received Alarm, but event is not correct`);
    }
}

function processMessage(event: GeneralEvent) {
    
    const directory = `${loggingConfig.dir}/${event.ipAddress}`;
    
    // Check if the directory exists
    fs.access(directory, fs.constants.F_OK, (err) => {
        if (err) {
            // Directory doesn't exist, create it recursively
            fs.mkdir(directory, { recursive: true }, (err) => {
                if (err) {
                    console.error(`Error creating directory: ${err}`);
                } else {
                    console.log(`Directory created: ${directory}`);
                }
            });
        } else {
            //console.log(`Directory already exists: ${directory}`);
        }
    });

    fs.writeFileSync ( `${directory}/${Date.now()}.json`, JSON.stringify(event, null, 2))

    if (event.eventType === "videoloss") {
        appLogger.info("Just a video loss event");
        return;
    }

    if (event.eventType === "AccessControllerEvent") {
        console.log("AccessControllerEvent Receieved")
        processAccessControllerEvent(event);
        return;
    }
    appLogger.info(`Mesage ${JSON.stringify(event)}`);

}

attendanceWorkflowRouter.post("/on-json-event", (req: Request, res: Response) => {
    const requestBody = EventSchema.safeParse(req.body);
    if (requestBody.success) {
        const event = requestBody.data;
        processMessage(event);
    } else {
        console.log(`Unable to process incoming message`, req.body);
    }
    res.send({
        success: true
    })
})

attendanceWorkflowRouter.post("/on-xml-event", (req: Request, res: Response) => {
    console.log(`Mesage`, req.body);
    res.send({
        success: true
    })
})

attendanceWorkflowRouter.post("/on-image", upload.single("image"), (req: Request, res: Response) => {
    const formdata = req.body;
    const file = req.files;
    console.log(formdata);
    console.log(file);
    res.send({
        success: true
    })
})

export default attendanceWorkflowRouter;

