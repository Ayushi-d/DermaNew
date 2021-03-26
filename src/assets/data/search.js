import {AgeRange, MultiSelect} from '../../components/Fields';
import data from './countryData';

const searchData = [
  {
    name: 'ag',
    label: 'Age',
    component: AgeRange,
    getData: 'AgeRange',
  },
  {
    name: 'sc',
    label: 'Skin Condition',
    component: MultiSelect,
    getData: 'Skin Condition',
    data: [
      "Doesn't matter",
      'Vitiligo',
      'Psoriasis',
      'Acne',
      'Eczema',
      'Dermatitis',
      'Scleroderma',
      'Albinism',
      'Alopecia',
      'Burn',
      'Scar',
      'Birthmark',
      'Neurofibroma',
      'Rosacea',
      'Ichthyosis',
      'Lichen Planus',
      'Melanoma',
      'Others',
      'No Skin Condition',
    ],
  },
  {
    name: 'ms',
    label: 'Marital Status',
    component: MultiSelect,
    getData: 'Marital Status',
    data: [
      "Doesn't matter",
      'Never Married',
      'Divorced',
      'Separated',
      'Widowed',
    ],
  },
  {
    name: 'rl',
    label: 'Religion Status',
    component: MultiSelect,
    getData: 'Religion Status',
    data: [
      "Doesn't matter",
      'Atheist',
      'Agnostic',
      'Buddhist',
      'Christian',
      'Hindu',
      'Jain',
      'Jewish',
      'Muslim',
      'Parsi',
      'Sikh',
    ],
  },
  {
    name: 'c',
    label: 'Country',
    component: MultiSelect,
    getData: 'Country',
    data: ["Doesn't matter", ...data],
  },
];

export default searchData;
