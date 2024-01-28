import express, { Request, Response, request, response } from "express"
import fs from "fs";
import { z } from 'zod';
import upload from "../lib/multer";
import appLogger from "../lib/logger";
import { getXataClient } from "../db/xata";
const xata = getXataClient();

const loggingConfig = {
    dir: "data/alarams",
}

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
        //console.log(alarmDetails);
    } else {
        appLogger.error(`Received Alarm, but event is not correct`);
    }
}

async function logMessage(event: GeneralEvent) {

    const eventRecord = await xata.db.HikCameraEvent.create({
        ipAddress: event.ipAddress,
        portNo: event.portNo,
        protocol: event.protocol,
        macAddress: event.macAddress,
        timestamp: new Date(event.dateTime),
        state: event.eventState,
        channelName: event.channelName,
        channelId: event.channelID,
        activePostCount: event.activePostCount,
    });

    if ( event.AccessControllerEvent ) { 
        const accessControlEventRecord = await xata.db.AccessControlEvent.create({
            ... event.AccessControllerEvent,
            relatedEvent: eventRecord.id,
          });
    }

}

function processMessage(event: GeneralEvent) {

    logMessage(event);

    if (event.eventType === "videoloss") {
        appLogger.info(`Just a video loss event from [${event.ipAddress}]`);
        return;
    }

    if (event.eventType === "AccessControllerEvent") {
        appLogger.info("AccessControllerEvent Recieved" + ` [${event.AccessControllerEvent?.subEventType}]`)
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
    const file = req.file;
    const eventString = req.body.event;
    
    if ( file) {
        //const fileBuffer = file.buffer;
        //const fileBase64 = fileBuffer.toString('base64');
        const json = JSON.parse(eventString) as GeneralEvent;
        processMessage(json);
    
    } 




    res.send({
        success: true
    })
})

export default attendanceWorkflowRouter;

