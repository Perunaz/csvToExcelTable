import csv from 'csvtojson';
import xlsx from "json-as-xlsx";

export async function convertCSV (req) {
    const fileName = req.file.originalname.slice(0, -4);
    const csvFilePath = `./uploads/${fileName}.csv`;
    const jsonArray=await csv().fromFile(csvFilePath);
    const headers = Object.keys(jsonArray[0]);

    let columns = [];

    headers.forEach(header => {
        const column = {label: header, value: header}
        columns.push(column)
    });

    let data = [
        {
        sheet: "sheet 1",
        columns: columns,
        content: jsonArray,
        },
    ];

    let settings = {
        fileName: `./response/${fileName}`,
        extraLength: 3,
        writeMode: "writeFile", 
        writeOptions: {
            type: "buffer",
        },
        RTL: false,
    };

    xlsx(data, settings);
};