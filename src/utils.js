const XLSX = require('xlsx');
const HEADERS = require('./headers.js');
const { headerFieldMap, fieldsOptionsMap, formFields } = require('./fields.js');

function listHeaders(worksheet) {
  const headers = [];
  const a1StyleRange = worksheet['!ref'];
  const range = XLSX.utils.decode_range(a1StyleRange);

  const headerRow = 0;
  const headerColumn = { start: range.s.c, end: range.e.c };

  for (let col = headerColumn.start; col <= headerColumn.end; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
    const cellValue = worksheet[cellAddress].v;

    headers.push(cellValue);
  }

  return headers;
}

function fileToJson(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const arrayOfObjects = XLSX.utils.sheet_to_json(worksheet, {});

  return arrayOfObjects;
}

function padNumber(number) {
  return number.toString().padStart(2, '0');
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hour = padNumber(date.getHours());
  const minute = padNumber(date.getMinutes());
  const second = padNumber(date.getSeconds());

  return `${year}-${month}-${day}_${hour}-${minute}-${second}`;
}

async function jsonToFile(arrayOfObjects, filename = '') {
  const newWorkbook = XLSX.utils.book_new();
  const newWorkSheet = XLSX.utils.json_to_sheet(arrayOfObjects, {
    header: HEADERS.all,
  });

  XLSX.utils.book_append_sheet(newWorkbook, newWorkSheet, 'Sheet1');

  const date = new Date();
  const formattedDate = formatDate(date);
  const newFileName = `${filename ? `${filename}_` : ''}${formattedDate}.xlsx`;
  try {
    await XLSX.writeFileAsync(
      newFileName,
      newWorkbook,
      { compression: true },
      () => {
        console.log(`Successfully created ${newFileName} file`);
      },
    );
    return true;
  } catch (error) {
    error;
    console.log(`ERROR: Could not create ${newFileName} file`);
    return false;
  }
}

function translateHeaderNames(entry) {
  const entryHeaders = Object.keys(entry);
  const headersToTanslate = entryHeaders.filter((header) =>
    headerFieldMap.has(header),
  );
  const nextEntry = {};

  headersToTanslate.forEach((header) => {
    const fieldName = headerFieldMap.get(header);

    nextEntry[fieldName] = entry[header];
  });

  return nextEntry;
}

function translateOptionValues(entry) {
  const fields = Object.keys(entry);
  const nextEntry = {};

  fields.forEach((field) => {
    let nextValue;

    if (typeof entry[field] === 'string') {
      const lowerCaseValue = entry[field].toLocaleLowerCase();
      nextValue = fieldsOptionsMap.get(field).get(lowerCaseValue);
    } else if (typeof entry[field] === 'number') {
      nextValue = entry[field].toString();
    }

    nextEntry[field] = nextValue;
  });

  return nextEntry;
}

function addDefaultFields(entry) {
  const nextEntry = { ...entry };
  nextEntry['Race'] = 'Other';
  nextEntry['Diabetic'] = 'No';
  nextEntry['OnAspirin'] = 'No';

  return nextEntry;
}

function getTypeOfField(field) {
  const { types } = formFields;
  if (types.number.includes(field)) {
    return 'number';
  } else if (types.string.includes(field)) {
    return 'string';
  }
}

function isValidFieldAndValue(field, value) {
  const typeOfValue = typeof value;
  const targetType = getTypeOfField(field);

  if (targetType !== typeOfValue) {
    return false;
  }
  if (typeOfValue === 'string' && value.trim().length === 0) {
    return false;
  }

  return true;
}

function removeInvalidData(entry) {
  const nextEntry = {};
  const entriesInEntry = Object.entries(entry);

  entriesInEntry.forEach(([field, value]) => {
    if (isValidFieldAndValue(field, value)) {
      nextEntry[field] = value;
    }
  });

  return nextEntry;
}

function entryToFormData(entry) {
  const entryWithFieldNames = translateHeaderNames(entry);
  const entryWithValidData = removeInvalidData(entryWithFieldNames);
  const entryWithTranslatedValues = translateOptionValues(entryWithValidData);
  const entryWithDefaultsFields = addDefaultFields(entryWithTranslatedValues);

  return entryWithDefaultsFields;
}

function hasAllRequiredFields(formData) {
  const fieldsInFormData = Object.keys(formData);
  const isValid = formFields.required.every((field) =>
    fieldsInFormData.includes(field),
  );

  return isValid;
}

module.exports = {
  listHeaders,
  fileToJson,
  jsonToFile,
  entryToFormData,
  hasAllRequiredFields,
};
