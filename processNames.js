const XLSX = require('xlsx');
const search = require('./search');
const searchResults = [];

module.exports = async function processNames({ names, sheet, city, country, resultsLength, requestXLSX }) {
  console.log(`Search in progress, total: ${names.length}`);
  for (const name of names) {
    console.log(`Searching ${names.indexOf(name) + 1} / ${names.length}:  ${name}  `);
    const searchObject = {};
    searchObject['name'] = name;
    const query = name;
    const results = await search(query, city, country);
    console.log(results);
    const trimmedResults = results
      .map((i) => i.substring(i.indexOf('http')))
      .filter((i) => i.includes('http'));
    const newRow = [name];
    trimmedResults.slice(0, resultsLength).forEach((result) => {
      const startIndex = result.includes('www') ? result.indexOf('.') + 1 : result.indexOf('//');
      const endIndex = result.includes('.co') ? result.indexOf('.co') : 25;
      const linkName = result.substring(startIndex, endIndex);
      newRow.push({ f: `=HYPERLINK("${result}", "${linkName}")` });
      searchObject[`result${trimmedResults.indexOf(result)}`] = { link: result, linkName: linkName };
    });

    searchResults.push(searchObject);
    // Add the new row to the worksheet
    if (requestXLSX) {
      XLSX.utils.sheet_add_aoa(sheet, [newRow], { origin: `A${names.indexOf(name) + 2}` });
    }
  }
  return searchResults;
};
