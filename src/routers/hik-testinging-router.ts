import express, { Request, Response } from "express"
import { boolean } from "zod";
const testingRouter = express.Router();


interface EventLog {
    ipAddress: string;
    portNo: number;
    protocol: string;
    macAddress: string;
    channelID: number;
    dateTime: string;
    activePostCount: number;
    eventType: string;
    eventState: string;
    eventDescription: string;
    AccessControllerEvent: AccessControllerEventDetails;
}
interface AccessControllerEventDetails {
    deviceName: string;
    majorEventType: number;
    subEventType: number;
    cardReaderKind: number;
    doorNo: number;
    serialNo: number;
    currentVerifyMode: string;
    frontSerialNo: number;
    attendanceStatus: string;
    label: string;
    statusValue: number;
    mask: string;
    helmet: string;
    purePwdVerifyEnable: boolean;
}

testingRouter.post("/on-event", (req: Request, res: Response) => {
    const formData = req.fields;
    console.log('Received form data:', formData);

    console.log(req.body);
    res.send({
        success: true
    });
})


export default testingRouter;