import React from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
} from 'react-native';

import Drop from '../../assets/general/ic_drop.png';

import DateTimePicker from '@react-native-community/datetimepicker';

import THEME from '../../config/theme';

class DatePick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: this._setInitialDate(),
      value: this.props.value || '',
      showDate: false,
    };
  }

  _setInitialDate = () => {
    let date = this.props.value ? this.props.value.split('-') : [];
    if (date.length == 0) {
      return this._maximumDate();
    }

    date = date.map(item => parseInt(item));

    return new Date(date[2], date[1] - 1, date[0]);
  };

  _setDate = (event, date) => {
    if (event.type == 'dismissed') {
      this.setState({showDate: false});
      return;
    }

    date = date || this.state.date;

    let value = this._getStringFromDate(date);

    this.setState(
      {
        showDate: false,
        date,
        value,
      },
      () => {
        this.props.pushChange(this.props.name, this.state.value);
      },
    );
  };

  _getStringFromDate = date => {
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

  _maximumDate = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();

    return new Date(year - 18, month, date - 1);
  };

  _minimumDate = () => {
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();

    return new Date(year - 70, month, date);
  };

  _showModal = () => {
    if (this.props.disabled) return false;
    this.setState({showDate: true});
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          style={style.inputContainer}
          onPress={this._showModal}
          disabled={this.props.disabled}
        >
          <TextInput
            style={[
              style.input,
              {
                backgroundColor: this.props.disabled
                  ? THEME.DISABLED
                  : THEME.WHITE,
                color: THEME.PARAGRAPH,
              },
            ]}
            value={this.state.value}
            editable={false}
            placeholder={'Select'}
          />
          {!this.props.notShowDrop &&
             <Image source={Drop} style={style.drop} />
          }
          <Text
            style={[
              style.label,
              {
                backgroundColor: this.props.disabled
                  ? 'transparent'
                  : THEME.WHITE,
              },
            ]}
          >
            {this.props.label}
          </Text>
          {this.state.showDate ? (
            <DateTimePicker
              value={this.state.date}
              mode={'date'}
              is24Hour={true}
              display="spinner"
              onChange={this._setDate}
              maximumDate={this._maximumDate()}
              minimumDate={this._minimumDate()}
            />
          ) : null}
        </TouchableOpacity>
        {this.props.error ? (
          <Text style={{color: THEME.ERROR_REG, padding: 5, fontSize: 12}}>
            {this.props.error}
          </Text>
        ) : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  input: {
    height: 50,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: THEME.PARAGRAPH,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    position: 'absolute',
    color: THEME.PARAGRAPH,
    fontSize: 12,
    height: 20,
    textAlign: 'center',
    lineHeight: 20,
    top: -10,
    left: 10,
    backgroundColor: THEME.WHITE,
    paddingHorizontal: 5,
  },
  drop: {
    width: 15,
    height: 15,
    opacity: 0.5,
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -7.5}],
  },
});

export default DatePick;
