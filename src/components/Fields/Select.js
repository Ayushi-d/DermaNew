import React from 'react';
import {View, Text, StyleSheet, TextInput, Picker, Image} from 'react-native';
import THEME from '../../config/theme';
import {Dropdown} from 'react-native-material-dropdown-v2';
import Drop from '../../assets/general/ic_drop.png';

class Select extends React.Component {
  constructor(props) {
    super(props);
  }

  parseValue = (value) => {
    if (value === 1) {
      return 'Show my name';
    }

    if (value === 0) return 'Hide my name';

    return value;
  };

  _renderBase = () => {
    return (
      <View style={style.inputContainer}>
        <TextInput
          style={[
            style.input,
            {
              backgroundColor: this.props.disabled
                ? THEME.DISABLED
                : THEME.WHITE,
            },
          ]}
          value={
            this.props.parseData
              ? this.parseValue(this.props.value) || ''
              : this.props.value
          }
          placeholder={this.props.placeholder || 'Select'}
        />
        <Image source={Drop} style={style.drop} />
        {this.props.label ? (
          <Text
            style={[
              style.label,
              {
                backgroundColor: this.props.disabled
                  ? 'transparent'
                  : THEME.WHITE,
              },
            ]}>
            {this.props.label}
          </Text>
        ) : null}
        {this.props.error ? (
          <Text style={{color: THEME.ERROR_REG, padding: 5}}>
            {this.props.error}
          </Text>
        ) : null}
      </View>
    );
  };

  _handleChange = (val) => {
    let value = val;
    if (this.props.parseData) {
      value = this.props.parseData[val];
    }

    this.props.pushChange(this.props.name, value);
  };

  render() {
    return (
      <View style={[style.container, this.props.style]}>
        <Dropdown
          label={this.props.label}
          data={this.props.data}
          rippleCentered={true}
          rippleColor={THEME.GRADIENT_BG.END_COLOR}
          itemTextStyle={{height: 40, lineHeight: 40}}
          dropdownPosition={this.props.dropDownPosition ? -1 : 0}
          fontSize={16}
          itemCount={8}
          renderBase={this._renderBase}
          onChangeText={this._handleChange}
          disabled={this.props.disabled ? true : false}
          pickerStyle={{
            maxHeight: 500,
          }}
        />
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
  },
  container: {
    marginTop: 20,
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

export default Select;
