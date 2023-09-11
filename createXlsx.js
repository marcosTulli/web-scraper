const data = require('./data.json');
const XLSX = require('xlsx');
const processNames = require('./processNames');

// Create a new workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet([]);

module.exports = async function createXlsx(names, city, country, resultsLength) {
  await processNames({
    names: names,
    sheet: worksheet,
    city: city,
    country: country,
    resultsLength: resultsLength,
    requestXLSX: true,
  }); // Wait for the search process to complete
  // Add the worksheet to the workbook

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Names');
  // Write the Excel file after all searches are done
  XLSX.writeFile(workbook, 'output.xlsx');

  const resultsHeaders = Array.from({ length: resultsLength + 1 }, (_, index) =>
    index === 0 ? 'Nombre' : `Resultado ${index}`
  );

  XLSX.utils.sheet_add_aoa(worksheet, [resultsHeaders], {
    origin: 'A1',
  });
};
