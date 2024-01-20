export interface AlarmMessage { 
    index: number; 
    contentLength: number,
    contentType?: string,  
    meta?: any,
    messageData: number[], 
}

export type AlarmBufferCallback = ( m : AlarmMessage ) => void
export class AlarmBuffer { 

    _buffer : Buffer = Buffer.from ("");
    i = 0; 

    constructor() { 

    }

    ParseAlarmData(incomingData: Buffer, boundary: string, imageOffset: number, dataOffset: number, callback : AlarmBufferCallback) {

        console.log("Incoming Buffer", incomingData.length);
        /// Join the Buffer as a whole 
        this._buffer = Buffer.concat([this._buffer, incomingData]);
        //console.log("Buffer Length", _buffer.length);
    
        /// Get the Buffer from the List 
        const data: number[] = Array.from(this._buffer);
    
        // Convert string to byte array using TextEncoder
        const encoder = new TextEncoder();
        const resultByteArray: number[] = Array.from(encoder.encode("--" + boundary ));
        let iNextBoundary = indexOf(data, 0, resultByteArray);
        let iLen = 0;
    
        /// Process the Incoming Message 
        while (iNextBoundary >= 0) {
    
            const currentIndex = iNextBoundary;
            iLen = iNextBoundary;
    
            // We need to know the next boundary, so that we can manage what to slice
            iNextBoundary = indexOf(data, iNextBoundary + ("--" + boundary).length, resultByteArray);
            if (iNextBoundary === -1) {
                break;
            }
    
            const dataBuffer = data.slice(currentIndex + resultByteArray.length, iNextBoundary);
            const contentLength = getContentLength(dataBuffer);
            const contentType = getContentType(dataBuffer);
            const meta = getOtherMeta(dataBuffer);
            const offset = contentType?.includes("image") ? imageOffset : dataOffset;
            const actualMessages = dataBuffer.slice(dataBuffer.length - contentLength - offset);
            
            callback ( {
                index: this.i,
                contentLength,
                contentType,
                messageData: [... actualMessages ]
            })
            this.i++;
        }
    
        this._buffer = Buffer.from( data.slice(iLen)); 
        console.log ( "Processing Buffer complete : ", iLen);
        console.log ( "Buffer left : ", this._buffer.length);
    }
}

function getContentLength(dataBuffer: number[]) {
    const contentLengthMatch = Buffer.from(dataBuffer).toString().match(/Content-Length:\s*(\d+)/);
    if (contentLengthMatch) {
        const messageLength = parseInt(contentLengthMatch[1], 10);
        return messageLength;
    } else {
        return dataBuffer.length;
    }
}

function getContentType(dataBuffer: number[]) {
    // Extracting the Content-Type from the raw HTTP response
    const contentTypeMatch = Buffer.from(dataBuffer).toString().match(/Content-Type:\s*([^\s;]+)/);

    if (contentTypeMatch) {
        const contentType = contentTypeMatch[1];
        return contentType;
    } else {
        console.error("Content-Type header not found or invalid format.");
    }
}

function getOtherMeta(dataBuffer: number[]) {

    // Extracting 'name' and 'filename' attributes from the Content-Disposition header
    const nameMatch = Buffer.from(dataBuffer).toString().match(/name="([^"]+)"/);
    const filenameMatch = Buffer.from(dataBuffer).toString().match(/filename="([^"]+)"/);
    if (nameMatch && filenameMatch) {
        const name = nameMatch[1];
        const filename = filenameMatch[1];
        return {
            name,
            filename
        }
    } else {
        return undefined;
        console.error("Unable to extract 'name' or 'filename' from Content-Disposition header.");
    }
}

function indexOf(src: number[], index: number, value: number[]): number {
    if (!src || !value) {
        return -1;
    }

    if (src.length === 0 || src.length < index || value.length === 0 || src.length < value.length) {
        return -1;
    }

    for (let i = index; i < src.length - value.length; i++) {
        if (src[i] === value[0]) {
            if (value.length === 1) {
                return i;
            }

            let flag = true;
            for (let j = 1; j < value.length; j++) {
                if (src[i + j] !== value[j]) {
                    flag = false;
                    break;
                }
            }

            if (flag) {
                return i;
            }
        }
    }

    return -1;
}
