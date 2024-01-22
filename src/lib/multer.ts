import multer from "multer";
import path from "path";

// Set up Multer to handle file uploads and save the image on disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Define the destination directory where the image will be saved
    },
    filename: function (req, file, cb) {
        console.log(file)
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});
const upload = multer({ storage: storage });

export default upload; 
