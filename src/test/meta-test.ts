import { XataFile } from "@xata.io/client"; // Generated with CLI
import { getXataClient } from "../db/xata";
import { fileToBase64 } from "../lib/base-64";

const xata = getXataClient();

export async function FindOne(id: string) {
    const record = await xata.db.MetaDump_Testing.read(id);
    return record;
}

export async function GetPage ( size : number) { 
    const page = await xata.db.MetaDump_Testing.select(["name"]).getPaginated({
      pagination: {
        size: size,
      },
    });
    return page;
}

export async function GetAll() {
    const records = await xata.db.MetaDump_Testing.select(["name"]).getAll();
    return records;
}

export async function Create(name: string, image: File) {
    const record = await xata.db.MetaDump_Testing.create({
        name: "longer text",
        snapshot: XataFile.fromBase64((await fileToBase64(image))),
    });
    return record.id;
}

export async function Delete(id: string) {
    const record = await xata.db.MetaDump_Testing.delete(id);
    console.log(record);
}

export async function Update(id: string, name: string, image: File) {
    const record = await xata.db.MetaDump_Testing.update(id, {
        name: "longer text",
        snapshot: XataFile.fromBase64((await fileToBase64(image))),
    });
    return record?.id;
}
