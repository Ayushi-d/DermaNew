import React from 'react';
import {View, Text, StyleSheet, TextInput, Image} from 'react-native';
import THEME from '../../config/theme';
import {Dropdown} from 'react-native-material-dropdown-v2';
import Drop from '../../assets/general/ic_drop.png';
import {CustomDropDown} from '../Fields';

class CountryDrop extends React.Component {
  constructor(props) {
    super(props);

    this.data = this.props.data.map(item => ({
      value: `${item.value} (${item.name})`,
    }));

    this.state = {
      value: this.props.defaultValue,
    };
  }

  _handleChange = val => {
    let value = val.split(' (')[0];
    this.setState({value: value}, () => {
      this.props.pushChange(this.state.value);
    });
  };

  getCurrentIndex = () => {
    let value = this.state.value;
    let currentIndex = 0;
    this.props.data.map((item, index) => {
      if (value == item.value) {
        currentIndex = index;
      }
    });

    return currentIndex;
  };

  render() {
    return (
      <View style={[style.container, this.props.style]}>
        <CustomDropDown
          data={this.data}
          handleChange={this._handleChange}
          pickerStyle={{
            width: 200,
          }}
          style={{
            marginTop: 0,
            height: 40,
          }}
          inputStyle={{
            height: 40,
          }}
          dropModalStyle={{
            width: 200,
          }}
          value={this.state.value}
          currentIndex={this.getCurrentIndex()}
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  input: {
    height: 40,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  container: {
    // marginTop: 20,
    width: 200,
  },
  inputContainer: {},
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

export default CountryDrop;
