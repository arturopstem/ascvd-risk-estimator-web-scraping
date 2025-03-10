const puppeteer = require('puppeteer');

const { entryToFormData, hasAllRequiredFields } = require('./utils.js');
const { formFields } = require('./fields.js');
const { getScoreTextAnnotations, getPercentagesObject } = require('./regex.js');
const { getInputValidationErrors } = require('./inputValidation.js');

const RISK_ESTIMATOR_URL =
  'https://tools.acc.org/ASCVD-Risk-Estimator-Plus/#!/calculate/estimate/';

async function scrapeWebToJson(worksheetAsJson) {
  const browser = await puppeteer.launch({
    headless: true,
    slowMo: 7,
  });
  const page = await browser.newPage();

  await page.goto(RISK_ESTIMATOR_URL);

  const nextWorksheetAsJson = [];

  console.time('Total time');
  for (let i = 0; i < worksheetAsJson.length; i++) {
    const entry = worksheetAsJson[i];
    const formData = entryToFormData(entry);
    const nextEntry = entry;

    if (hasAllRequiredFields(formData)) {
      await fillInTheForm(page, formData);

      const output = await getFormOutput(page);
      Object.assign(nextEntry, output);
    } else {
      Object.assign(nextEntry, { annotations: 'FALTAN DATOS REQUERIDOS' });
    }

    nextWorksheetAsJson.push(nextEntry);

    await resetForm(page);
    console.log(`Entry nº${i}`);
  }
  console.timeEnd('Total time');

  await page.close();
  await browser.close();

  return nextWorksheetAsJson;
}

async function fillInTheForm(page, formData) {
  const entries = Object.entries(formData);

  for (let i = 0; i < entries.length; i++) {
    const [field, value] = entries[i];
    const action = actionOfField(field);
    const selector = formatSelector(action, field, value);

    await fillInField(page, action, selector, value);
  }
}

function actionOfField(field) {
  const { actions } = formFields;

  if (actions.type.includes(field)) {
    return 'type';
  }
  if (actions.click.includes(field)) {
    return 'click';
  }
}

function formatSelector(action, field, value) {
  if (action === 'type') {
    return `input[data-bind*="${field}"]`;
  }
  if (action === 'click') {
    return `a[data-bind*="${field}"] ::-p-text(${value})`;
  }
}

async function fillInField(page, action, selector, value) {
  if (action === 'type') {
    await page.type(selector, value);
  }
  if (action === 'click') {
    await page.locator(selector).click();
  }
}

async function getFormOutput(page) {
  const output = {};

  const scoreBarHolder = await page.waitForSelector('.score-bar-holder', {
    timeout: 300,
  });
  const scoreText = await scoreBarHolder?.evaluate((el) => el.innerText);

  const percentages = getPercentagesObject(scoreText);
  Object.assign(output, percentages);

  const annotations = getScoreTextAnnotations(scoreText);
  if (annotations) {
    Object.assign(output, { annotations });
  }

  const inputErrors = await getInputValidationErrors(page);
  if (inputErrors) {
    Object.assign(output, { inputErrors });
  }

  return output;
}

async function resetForm(page) {
  await page.locator('a[data-bind*="resetAll"] ::-p-text(Reset All)').click();
}

module.exports = { scrapeWebToJson };
