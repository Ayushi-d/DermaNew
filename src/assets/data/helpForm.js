import {
  Select,
  TextArea,
  TextIn,
  UploadFile,
  CustomDropDown,
} from '../../components/Fields';

const helpForm = [
  {
    name: 'mail',
    label: 'Email *',
    component: TextIn,
  },
  {
    name: 'cmail',
    label: 'Confirm Email *',
    component: TextIn,
  },
  {
    name: 'sub',
    label: 'Subject *',
    component: CustomDropDown,
    data: [
      'Registration and Login',
      'My Profile and Photos',
      'Search & My Matches',
      'Contacting other users',
      'Report misuse',
      'Feedback',
      'Others',
    ],
  },
  {
    name: 'des',
    label: 'Description *',
    component: TextArea,
  },
  {
    name: 'url',
    label: 'Attach Image',
    component: UploadFile,
  },
];

export default helpForm;
