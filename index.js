import express from "express";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url'; // Import fileURLToPath

import { convertCSV } from "./csvToExcel.js";

const __filename = fileURLToPath(import.meta.url); // Get filename from import.meta.url
const __dirname = path.dirname(__filename); // Get dirname from filename

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads/')); // Use path.join to construct absolute path
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('csvFile'), async (req, res) => {
    const fileName = req.file.originalname.slice(0, -4);
    const xlsxFilePath = path.join(__dirname, `response/${fileName}.xlsx`);
    const csvFilePath = path.join(__dirname, `uploads/${fileName}.csv`);
    
    await convertCSV(req);

    res.sendFile(xlsxFilePath, function (err) {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }

        fs.unlinkSync(csvFilePath);
        fs.unlinkSync(xlsxFilePath);
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});