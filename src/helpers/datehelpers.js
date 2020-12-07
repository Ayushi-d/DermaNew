import moment from 'moment';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

Date.prototype.formatDate = function() {
  let day = this.getDate();
  let monthIndex = this.getMonth();
  let year = this.getFullYear();

  return `${monthNames[monthIndex]} ${day}`;
};

Date.prototype.formatDateWithoutMonth = function() {
  let day = this.getDate();
  let monthIndex = this.getMonth();
  let year = this.getFullYear();

  return `${monthNames[monthIndex]} ${day}`;
};

class DateHelpers {}

DateHelpers.getStringFromDate = date => {
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  if (month.length == 1) {
    month = '0' + month;
  }

  if (day.length == 1) {
    day = '0' + day;
  }

  let value = `${day}-${month}-${year}`;

  return value;
};

DateHelpers.getDateFromString = bday => {
  let date = bday ? bday.split('-') : [];
  date = date.map(item => parseInt(item));
  return new Date(date[2], date[1] - 1, date[0]);
};

DateHelpers.getAge = date => {
  let bday = DateHelpers.getDateFromString(date);
  let ageDifMs = Date.now() - bday.getTime();
  let ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

DateHelpers.getDateFromTimeStamp = tp => {
  let date = new Date(parseFloat(tp) * 1000);
  let today = new Date();

  return date.toLocaleDateString() == today.toLocaleDateString()
    ? DateHelpers.getTimeInAMPM(date)
    : date.formatDate();
};

// DateHelpers.formatDate = date => {

// }

DateHelpers.getTimeInAMPM = date => {
  let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const am_pm = date.getHours() >= 12 ? 'PM' : 'AM';
  hours = hours < 10 ? '0' + hours : hours;
  let minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  // let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  let time = hours + ':' + minutes + ' ' + am_pm;

  return time;
};

DateHelpers.getTodayInReadableFormat = () => {
  let date = new Date();
  let monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  let weekday = date.getDay();

  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();

  return (
    weekdays[weekday] + ', ' + day + ' ' + monthNames[monthIndex] + ' ' + year
  );
};

DateHelpers.getTodayInDDMMYYYY = () => {
  let date = new Date();

  let day = date.getDate();
  let monthIndex = date.getMonth();
  let year = date.getFullYear();

  return day + '-' + (parseInt(monthIndex) + 1).toString() + '-' + year;
};

DateHelpers.getTimeForMessage = tp => {
  let date = new Date(parseFloat(tp) * 1000);
  let today = new Date();

  return date.toLocaleDateString() == today.toLocaleDateString()
    ? DateHelpers.formatAMPM(date)
    : date.formatDateWithoutMonth() + ', ' + DateHelpers.formatAMPM(date);
};

DateHelpers.formatAMPM = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

export default DateHelpers;
