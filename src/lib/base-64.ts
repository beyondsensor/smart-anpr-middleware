
import * as fs from 'fs';

export function filePathToBase64(filePath: string): string {
    // Read file synchronously
    const fileData: Buffer = fs.readFileSync(filePath);
    // Convert file data to Base64
    const base64String: string = fileData.toString('base64');
    return base64String;
}

export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const base64String: string = reader.result as string;
            resolve(base64String.split(',')[1]); // Remove data URL prefix
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsDataURL(file);
    });
}