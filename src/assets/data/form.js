import {
  TextIn,
  Select,
  Gender,
  DatePick,
  ProfessionList,
  CustomDropDown,
} from '../../components/Fields';
import data from './countryData';

const RegistrationForm = [
  [
    {
      name: 'g',
      label: 'Gender',
      component: Gender,
      getData: true,
    },
    {
      name: 'dob',
      label: 'Date of Birth',
      component: DatePick,
    },
    {
      name: 'ht',
      label: 'Height',
      component: CustomDropDown,
      data: [
        '4\' 5" (135 cms)',
        '4\' 6" (137 cms)',
        '4\' 7" (140 cms)',
        '4\' 8" (142 cms)',
        '4\' 9" (145 cms)',
        '4\' 10" (147 cms)',
        '4\' 11" (150 cms)',
        '5\' 0" (152 cms)',
        '5\' 1" (155 cms)',
        '5\' 2" (157 cms)',
        '5\' 3" (160 cms)',
        '5\' 4" (163 cms)',
        '5\' 5" (165 cms)',
        '5\' 6" (168 cms)',
        '5\' 7" (170 cms)',
        '5\' 8" (173 cms)',
        '5\' 9" (175 cms)',
        '5\' 10" (178 cms)',
        '5\' 11" (180 cms)',
        '6\' 0" (183 cms)',
        '6\' 1" (185 cms)',
        '6\' 2" (188 cms)',
        '6\' 3" (191 cms)',
        '6\' 4" (193 cms)',
        '6\' 5" (196 cms)',
        '6\' 6" (198 cms)',
        '6\' 7" (201 cms)',
        '6\' 8" (203 cms)',
        '6\' 9" (206 cms)',
        '6\' 10" (208 cms)',
        '6\' 11" (211 cms)',
        '7\' 0" (213 cms)',
      ],
    },
    {
      name: 'sc',
      label: 'Skin Condition',
      component: CustomDropDown,
      data: [
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
      name: 'nm',
      label: 'Name',
      component: TextIn,
      placeholder: 'Enter your name',
    },
    {
      name: 'pnm',
      label: 'Privacy setting for name',
      component: CustomDropDown,
      data: ['Show my name', 'Hide my name'],
      parseData: {
        'Show my name': 1,
        'Hide my name': 0,
      },
    },
    {
      name: 'em',
      label: 'Email',
      component: TextIn,
      placeholder: 'Enter your email',
    },
  ],
  [
    {
      name: 'c',
      label: 'Country',
      component: CustomDropDown,
      data: data,
    },
    {
      name: 's',
      label: 'State / Province',
      component: CustomDropDown,
      fetchFromServer: true,
    },
    {
      name: 'ct',
      label: 'City',
      component: CustomDropDown,
      fetchFromServer: true,
    },
    {
      name: 'he',
      label: 'Highest Education',
      component: CustomDropDown,
      data: [
        'Doctorate',
        'Masters',
        'Honours degree',
        'Bachelors',
        'Undergraduate',
        'Associates degree',
        'Diploma',
        'Trade school',
        'High school',
      ],
    },
    {
      name: 'ef',
      label: 'Education Field',
      component: CustomDropDown,
      data: [
        'Arts',
        'Administrative Services',
        'Architecture',
        'Commerce',
        'Computers/IT',
        'Design',
        'Education',
        'Engineering/Technology',
        'Fashion',
        'Finance',
        'Fine Arts',
        'Hotel Management',
        'Journalism',
        'Law',
        'Management',
        'Medicine',
        'Nursing/Health Sciences',
        'Psychology',
        'Science',
        'Other',
        'Not Applicable',
      ],
    },
    {
      name: 'p',
      label: 'Profession',
      component: ProfessionList,
      data: {
        'Non-working': [
          'Student',
          'Looking for a job',
          'Not working',
          'Retired',
        ],
        'IT/Computers & Software': [
          'Software Professional',
          'Hardware & Networking professional',
          'Web / Graphic Designer',
        ],
        'Engineer(Non IT)': [
          'Civil Engineer',
          'Electrical Engineer',
          'Mechanical Engineer',
          'Non-IT Engineer',
        ],
        'Self Employed': [
          'Agent / Broker / Trader',
          'Business Person',
          'Entrepreneur',
        ],
        'Marketing & Sales': [
          'Marketing Professional',
          'Sales Professional',
          'Product Manager',
          'Logistics/ Supply chain management',
          'Business Analyst',
          'Digital Marketing',
        ],
        'Accounting, Banking & Finance': [
          'Banking Professional',
          'Chartered Accountant',
          'Company Secretary',
          'Finance Professional',
          'Financial Analyst',
          'Investment Professional',
          'Accounting Professional',
        ],
        'Administration & HR': [
          'Admin Professional',
          'Front office/ Secretary',
          'Human Resources Professional',
        ],
        'Education & Training': [
          'Principal/Director',
          'Professor',
          'Lecturer',
          'Teacher',
          'Research Professional',
          'Librarian',
          'Adjunct Faculty/Instructor',
        ],
        'Medical & Healthcare': [
          'Dentist',
          'Doctor',
          'Medical Transcriptionist',
          'Nurse',
          'Pharmacist',
          'Physiotherapist',
          'Psychologist',
          'Veterinary Doctor',
          'Yoga Teacher',
          'Healthcare Professional',
        ],
        'Media Advertising & Entertainment': [
          'Actor/Model',
          'Advertising Professional',
          'Entertainment Professional',
          'Event Manager',
          'Journalist',
          'Media Professional',
          'Public Relations Professional',
        ],
        Agriculture: ['Farmer', 'Horticulturist', 'Agriculture Professional'],
        'Airline & Aviation': [
          'Air Hostess / Flight Attendant',
          'Pilot / Co-Pilot',
          'Aviation Professional',
        ],
        'Architecture & Design': [
          'Architect',
          'Interior Designer',
          'Landscape Architect',
        ],
        'Artists, Animators & Web Designers': [
          'Animator',
          'Commercial Artist',
          'Painter',
          'Artist',
        ],
        'Beauty, Fashion & Jewellery': [
          'Beautician/Cosmetologist',
          'Makeup artist',
          'Fashion Designer',
          'Hairstylist',
          'Jewellery Designer',
        ],
        'BPO, KPO, & Customer Support': ['BPO / KPO / Customer support'],
        'Civil Services / Law Enforcement': [
          'Civil servant',
          'Police',
          'Law Enforcement Employee',
          'Security Professional',
        ],
        Defense: ['Airforce', 'Army', 'Navy', 'Defense Services'],
        'Hotel & Hospitality': [
          'Chef / Sommelier / Food Critic',
          'Catering Professional',
          'Hotel & Hospitality Professional',
        ],
        Legal: ['Lawyer', 'Legal Professional', 'Judge'],
        'Merchant Navy': ['Merchant Naval Officer', 'Mariner'],
        Science: ['Biologist / Botanist', 'Physicist', 'Researcher/Scientist'],
        'Corporate Professionals': [
          'CEO / Chairman / President',
          'VP / GM',
          'Sr. Manager / Manager',
          'Consultant / Supervisor / Team Leads',
        ],
        More: [
          'Photographer',
          'Blogger/Vlogger',
          'Writer',
          'Politician',
          'Social Worker / NGO',
          'Sportsperson',
          'Gym instructor',
          'Fitness Professional',
          'Operator/ Technician',
          'Travel & Tourism Professional',
          'Transportation Professional',
          'Others',
        ],
      },
    },
    {
      name: 'dk',
      label: 'Drink',
      component: CustomDropDown,
      data: ['Socially', 'Never', 'Often', 'Trying to quit'],
    },
    {
      name: 'sk',
      label: 'Smoke',
      component: CustomDropDown,
      data: ['Occasionally', 'Never', 'Regularly', 'Trying to quit'],
    },
    {
      name: 'ms',
      label: 'Marital Status',
      component: CustomDropDown,
      data: ['Never Married', 'Divorced', 'Separated', 'Widowed'],
      dropDownPosition: true,
    },
    {
      name: 'rl',
      label: 'Religion',
      component: CustomDropDown,
      data: [
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
      dropDownPosition: true,
    },
  ],
];

export default RegistrationForm;
