const headerFieldMap = new Map([
  ['Age', 'Age'],
  ['Sex', 'Sex'],
  ['Systolic', 'BloodPressure'],
  ['Diastolic', 'DBloodPressure'],
  ['Total Choles', 'TotalCholesterol'],
  ['HDL', 'HDLCholesterol'],
  ['LDL ch', 'LDLCholesterol'],
  ['Tabaco', 'Smoker'],
  ['Hypertension', 'Hypertension'],
  ['Statin', 'OnStatin'],
]);

const formFields = {
  all: [
    'Age',
    'BloodPressure',
    'DBloodPressure',
    'TotalCholesterol',
    'HDLCholesterol',
    'LDLCholesterol',
    'Sex',
    'Race',
    'Diabetic',
    'Smoker',
    'Hypertension',
    'OnStatin',
    'OnAspirin',
  ],
  required: [
    'Age',
    'Sex',
    'Race',
    'BloodPressure',
    'DBloodPressure',
    'TotalCholesterol',
    'HDLCholesterol',
    'Diabetic',
    'Smoker',
    'Hypertension',
  ],
  number: [
    'Age',
    'BloodPressure',
    'DBloodPressure',
    'TotalCholesterol',
    'HDLCholesterol',
    'LDLCholesterol',
  ],
  string: [
    'Sex',
    'Race',
    'Diabetic',
    'Smoker',
    'Hypertension',
    'OnStatin',
    'OnAspirin',
  ],
  types: {
    number: [
      'Age',
      'BloodPressure',
      'DBloodPressure',
      'TotalCholesterol',
      'HDLCholesterol',
      'LDLCholesterol',
    ],
    string: [
      'Sex',
      'Race',
      'Diabetic',
      'Smoker',
      'Hypertension',
      'OnStatin',
      'OnAspirin',
    ],
  },
  actions: {
    type: [
      'Age',
      'BloodPressure',
      'DBloodPressure',
      'TotalCholesterol',
      'HDLCholesterol',
      'LDLCholesterol',
    ],
    click: [
      'Sex',
      'Race',
      'Diabetic',
      'Smoker',
      'Hypertension',
      'OnStatin',
      'OnAspirin',
    ],
  },
};

const fieldsOptionsMap = new Map([
  [
    'Sex',
    new Map([
      ['masculino', 'Male'],
      ['femenino', 'Female'],
    ]),
  ],
  [
    'Smoker',
    new Map([
      ['si consume tabaco', 'Current'],
      ['no consume tabaco', 'Never'],
    ]),
  ],
  [
    'Hypertension',
    new Map([
      ['con hta', 'Yes'],
      ['sin hta', 'No'],
    ]),
  ],
  [
    'OnStatin',
    new Map([
      ['si toma estatina', 'Yes'],
      ['no toma estatina', 'No'],
    ]),
  ],
]);

module.exports = { headerFieldMap, formFields, fieldsOptionsMap };
