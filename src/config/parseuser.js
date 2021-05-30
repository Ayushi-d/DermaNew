const UserConfig = {
  'ABOUT ME': 'ae',
  'About Me': 'ae',
  'About me': 'ae',
  Name: 'nm',
  'Privacy Setting For Name': 'pnm',
  'Date of Birth': 'dob',
  'Skin Condition': 'sc',
  'Marital Status': 'ms',
  City: 'ct',
  State: 's',
  Country: 'c',
  Religion: 'rl',
  Education: 'ef',
  Profession: 'p',
  'Highest Education': 'he',
  Interest: 'in',
  Drink: 'dk',
  Smoke: 'sk',
  Age: 'pa',
  Location: 'c',
  'Education Field': 'ef',
  AgeRange: 'pa',
  Children: 'ch',
  'Do you have children': 'ch',
  Diet: 'dt',
  'State / Province': 's',
};

/**
 *
 * @param {*} obj
 * @param {*} field
 */

const getData = (obj, field, pp = false, edit = false) => {
  if (!obj) return '';
  if (pp) {
    let val = getPP(obj.pp, field);
    return val;
  }

  if (field == 'Education') {
    return `${obj['he']} - ${obj['ef'] == 'Not Applicable' ? '' : obj['ef']}`;
  }

  let ch = UserConfig[field];

  // console.log(field, ch);

  if (ch == 'in') {
    return obj[ch] ? obj[ch].split(',') : [];
  }

  if (ch == 'pnm' && !edit) {
    return obj[ch] == 1 ? 'Show my name' : 'Hide my name';
  }

  if (ch == 'pnm' && edit) {
    return obj[ch];
  }

  if (field == 'ABOUT ME') {
    return obj['ae'] || obj['nae'];
  }

  if (field == 'About Me') {
    return obj['nae'];
  }

  return obj[ch] ? obj[ch] : '';
};

/**
 * a1 - min age
 * a2 - max age
 * c - city
 * sc - skin condition
 * ms - marital status
 * rl -religion
 */

/**
 *
 * @param {*} pp @partnerPreference
 * @param {*} field @objField
 */

const getPP = (pp, field) => {
  let ch = UserConfig[field];

  if (ch == 'pa' && field == 'AgeRange') return [pp.a1, pp.a2];

  if (ch == 'pa') return `${pp.a1} to ${pp.a2} Yrs`;

  return pp[ch];
};

export default UserConfig;

export {getData};
