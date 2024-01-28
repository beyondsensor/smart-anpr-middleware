import { getXataClient } from "../../db/xata";
import { EventSchema } from "./types"
const xata = getXataClient();

const AttendanceTakingService = {
    OnFacialEvent : async function(meta: any, snapshotInBase64: string) {
        try {
            const results = EventSchema.parse(meta);
    
            /// Add the Hik Event into the Database 
            const event = await xata.db.HikCameraEvent.create({
                ipAddress: results.ipAddress,
                macAddress: results.macAddress,
                portNo: results.portNo,
                protocol: results.protocol,
                timestamp: new Date(results.dateTime),
                state: results.eventState,
                channelId: results.channelID,
                activePostCount: results.activePostCount
            });
    
            if (results.AccessControllerEvent) {
                /// Add Access Control Event 
                const accessControlEvent = xata.db.AccessControlEvent.create({
                    name: results.AccessControllerEvent.name,
                    mask: results.AccessControllerEvent.mask,
                    label: results.AccessControllerEvent.label,
                    doorNo: results.AccessControllerEvent.doorNo,
                    helmet: results.AccessControllerEvent.helmet,
                    serialNo: results.AccessControllerEvent.serialNo,
                    deviceName: results.AccessControllerEvent.deviceName,
                    statusValue: results.AccessControllerEvent.statusValue,
                    majorEventType: results.AccessControllerEvent.majorEventType,
                    subEventType: results.AccessControllerEvent.subEventType,
                    cardReaderKind: results.AccessControllerEvent.cardReaderKind,
                    attendanceStatus: results.AccessControllerEvent.attendanceStatus,
                    purePwdVerifyEnable: results.AccessControllerEvent.purePwdVerifyEnable,
                    cardReaderNo: results.AccessControllerEvent.cardReaderNo,
                    employeeNoString: results.AccessControllerEvent.employeeNoString,
                    picturesNumber: results.AccessControllerEvent.picturesNumber,
                    userType: results.AccessControllerEvent.userType,
                    verifyNo: results.AccessControllerEvent.verifyNo,
                    faceRect: { ...results.AccessControllerEvent.FaceRect },
                    snapshot: {
                        name: "snapshot.jpg",
                        mediaType: "image/jpeg",
                        base64Content: snapshotInBase64
                    },
                    relatedEvent: event.id
                });
                return { accessControlEvent };
            }
    
        } catch (error) {
            throw { status: 400, message: "Unable to process meta data" }
        }
    }
}

export default AttendanceTakingService; 