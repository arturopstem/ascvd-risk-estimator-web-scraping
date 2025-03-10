const { fileToJson, jsonToFile } = require('./src/utils.js');
const { scrapeWebToJson } = require('./src/driver.js');

(async () => {
  const inputFilePath = './inputDatabase.xlsx';

  const worksheetAsJson = fileToJson(inputFilePath);

  const newJsonWorksheet = await scrapeWebToJson(worksheetAsJson);

  await jsonToFile(newJsonWorksheet, 'output');
})();
