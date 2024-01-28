import { XataFile } from "@xata.io/client"; // Generated with CLI
import { getXataClient } from "../../db/xata";
import { fileToBase64 } from "../../lib/base-64";
import multer  from "multer";
const xata = getXataClient();

async function FindOne(id: string) {
    const record = await xata.db.MetaDump_Testing.read(id);
    return record;
}

async function GetPage ( size : number) { 
    const page = await xata.db.MetaDump_Testing.select(["name"]).getPaginated({
      pagination: {
        size: size,
      },
    });
    return page;
}

async function GetAll() {
    const records = await xata.db.MetaDump_Testing.select(["name"]).getAll();
    return records;
}

async function Create(name: string, image : string ) {
    try { 
        const record = await xata.db.MetaDump_Testing.create({
            name: name,
            snapshot: { 
                name: 'image.jpg', 
                mediaType: 'image/jpeg', 
                base64Content: image
            }
        });
        return record.id;
    } catch ( error ) { 
        console.log ( error )
    }
}

async function Delete(id: string) {
    const record = await xata.db.MetaDump_Testing.delete(id);
    console.log(record);
}

async function Update(id: string, name: string, image: File) {
    const record = await xata.db.MetaDump_Testing.update(id, {
        name: "longer text",
        snapshot: XataFile.fromBase64((await fileToBase64(image))),
    });
    return record?.id;
}

const service = { 
    FindOne, 
    GetAll, 
    GetPage, 
    Delete, 
    Update, 
    Create
}
export default service;

