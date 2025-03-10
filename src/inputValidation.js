async function getInputValidationErrors(page) {
  let errors = '';

  // console.log('Cholesterol Element');
  const totalCholesterolElement = await page.waitForSelector(
    'span.text[data-bind*="totalCholesterolValidation"]',
    { timeout: 300 },
  );
  const totalCholesterolErrorText = await totalCholesterolElement?.evaluate(
    (el) => el.innerText.trim(),
  );

  const ldlCholesterolElement = await page.waitForSelector(
    'span.text[data-bind*="ldlValidation"]',
    { timeout: 300 },
  );
  const ldlCholesterolErrorText = await ldlCholesterolElement?.evaluate((el) =>
    el.innerText.trim(),
  );

  const hdlCholesterolElement = await page.waitForSelector(
    'span.text[data-bind*="hdlValidation"]',
    { timeout: 300 },
  );
  const hdlCholesterolErrorText = await hdlCholesterolElement?.evaluate((el) =>
    el.innerText.trim(),
  );

  if (totalCholesterolErrorText) {
    errors += 'Total Cholesterol. ';
  }

  if (hdlCholesterolErrorText) {
    errors += 'HDL Cholesterol. ';
  }

  if (ldlCholesterolErrorText) {
    errors += 'LDL Cholesterol. ';
  }

  return errors.trimEnd();
}

module.exports = { getInputValidationErrors };
