const express = require('express');
const app = express();
const data = require('./data.json');
const XLSX = require('xlsx');
const processNames = require('./processNames');
const { createXlsx } = require('./createXlsx');
const city = 'Mar del Plata';
const country = 'Argentina';
const PORT = process.env.PORT || 3000;
const names = [];
const results = 8;

app.use(express.json());

data.forEach((i) => {
  !names.includes(i.name) && names.push(i.name);
});

async function main() {
  await processNames({
    names: names,
    sheet: worksheet,
    city: city,
    country: country,
    resultsLength: results,
    requestXLSX: true,
  }); // Wait for the search process to complete
  // Add the worksheet to the workbook

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Names');
  // Write the Excel file after all searches are done
  XLSX.writeFile(workbook, 'output.xlsx');
}

// Create a new workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet([]);

app.get('/', async (req, res) => {
  const args = {
    names: names,
    city: city,
    country: country,
    resultsLength: results,
    requestXLSX: false,
  };
  try {
    const result = await processNames(args); // Wait for the search process to complete
    args.requestXLSX = true;
    createXlsx(args);
    res.status(200).send(result);
    console.log('OK');
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Create an array of headers using Array.from()
const resultsHeaders = Array.from({ length: results + 1 }, (_, index) =>
  index === 0 ? 'Nombre' : `Resultado ${index}`
);

XLSX.utils.sheet_add_aoa(worksheet, [resultsHeaders], {
  origin: 'A1',
});

// main(); // Call the main function to start the process

// app.listen(PORT, () => {
//   console.log('Running on port ', PORT);
// });
