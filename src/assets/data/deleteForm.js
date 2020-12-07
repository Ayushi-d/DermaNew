import {Select, TextArea, CustomDropDown} from '../../components/Fields';

const deleteForm = [
  {
    name: 'sub',
    label: 'Select Reason *',
    component: CustomDropDown,
    data: [
      'Found my partner on Derma Cupid',
      'Found my partner somewhere else',
      'I need a break',
      "I didn't find it useful",
      'Other Reason',
    ],
  },
  {
    name: 'md',
    label: 'More Details',
    component: TextArea,
  },
];

export default deleteForm;
