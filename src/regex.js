const no10YearRiskForLDLls70Regex =
  /10-year ASCVD risk not available for patients with LDL-C < 70 mg\/dL\. See Advice tab for more information on managing other risk factors\./;

const no10YearRiskTooYoungRegex =
  /This calculator only provides 10-year risk estimates for individuals 40-79 years of age\..*?Click here to view brief suggestions for younger patients\./;

const no10YearRiskLDLgt190SuggestionRegex =
  /High intensity statin initiation in patients with LDL-C ≥ 190 mg\/dL \(4.9 mmol\/L\) is strongly recommended\. See Advice tab in for more details\./;

const notInLifetimeRiskRangeRegex =
  /Lifetime Risk Calculator only provides lifetime risk estimates for individuals 20 to 59 years of age\./;

const notInOptimalRiskAgeRangeRegex =
  /Optimal ASCVD Risk Calculator only provides optimal risk estimates for individuals 40 to 79 years of age\./;

function getScoreTextAnnotations(scoreText) {
  let annotations = '';

  const no10YearRiskTooYoung = no10YearRiskTooYoungRegex.test(scoreText);
  const no10YearRiskForLDLls70 = no10YearRiskForLDLls70Regex.test(scoreText);

  const notInOptimalRiskAgeRange =
    notInOptimalRiskAgeRangeRegex.test(scoreText);

  const no10YearRiskLDLgt190Suggestion =
    no10YearRiskLDLgt190SuggestionRegex.test(scoreText);
  const notInLifetimeRiskRange = notInLifetimeRiskRangeRegex.test(scoreText);

  if (no10YearRiskForLDLls70) {
    annotations += 'Sin Current 10-Year Risk por tener LDL-C < 70 mg/dL. ';
  }

  if (no10YearRiskTooYoung) {
    annotations += 'Sin Current 10-Year Risk porque solo de 40 a 79 años. ';
  }

  if (notInOptimalRiskAgeRange) {
    annotations += 'Sin Optimal Risk porque solo de 40 a 79 años. ';
  }

  if (no10YearRiskLDLgt190Suggestion) {
    annotations +=
      'Sin Current 10-Year Risk pero con sugerencia por tener LDL-C ≥ 190 mg/dL. ';
  }
  if (notInLifetimeRiskRange) {
    annotations += 'Sin Lifetime Risk porque solo de 20 a 59 años. ';
  }

  return annotations.trimEnd();
}

const currentRiskRegex = /^(?<percent>.*?%)/g;
const lifetimeRiskRegex = /Lifetime ASCVD Risk:.*?(?<percent>\d.*%)/g;
const optimalRiskRegex = /Optimal ASCVD Risk:.*?(?<percent>\d.*%)/g;

function getPercentagesObject(scoreText) {
  const percentages = {};

  const currentRisk = [...scoreText.matchAll(currentRiskRegex)]?.[0]?.groups
    ?.percent;

  const lifetimeRisk = [...scoreText.matchAll(lifetimeRiskRegex)]?.[0]?.groups
    ?.percent;

  const optimalRisk = [...scoreText.matchAll(optimalRiskRegex)]?.[0]?.groups
    ?.percent;

  if (currentRisk) {
    percentages['Current 10-Year ASCVD Risk'] = currentRisk;
  }
  if (lifetimeRisk) {
    percentages['Lifetime ASCVD Risk'] = lifetimeRisk;
  }
  if (optimalRisk) {
    percentages['Optimal ASCVD Risk'] = optimalRisk;
  }

  return percentages;
}

module.exports = { getScoreTextAnnotations, getPercentagesObject };
