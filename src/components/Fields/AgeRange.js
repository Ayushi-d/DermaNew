import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Select from './Select';
import THEME from '../../config/theme';
import {ScrollView} from 'react-native-gesture-handler';
import CustomDropDown from './CustomDropDown';

let data = [
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
];

data = data.map((item) => ({value: `${item}`}));

class AgeRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        a1: `${this.props.value[0]}` || '',
        a2: `${this.props.value[1]}` || '',
      },
    };
  }

  _pushChange = (name, val) => {
    let value = {...this.state.value};
    value[name] = val;
    if (name === 'a1') {
      let a1 = parseInt(value.a1);
      let a2 = parseInt(value.a2);
      if (a1 + 4 >= 70) {
        value['a2'] = 70;
      } else if (a2 < a1 + 4) {
        value['a2'] = a1 + 4;
      }
    }
    this.setState({value}, () => {
      this.saveChanges();
    });
  };

  saveChanges = () => {
    this.props.pushChange(this.props.name, [
      this.state.value.a1,
      this.state.value.a2,
    ]);
  };

  render() {
    let {a1} = this.state.value;
    let data2 = data.filter((d) => {
      if (parseInt(a1) + 4 >= 70) {
        return d.value == 70;
      }
      return d.value >= parseInt(a1) + 4;
    });
    return (
      <View>
        <View style={style.container}>
          <CustomDropDown
            data={data}
            label={'Age'}
            style={style.inp}
            pushChange={this._pushChange}
            name={'a1'}
            value={this.state.value.a1}
          />
          <Text style={{color: THEME.GRAY}}>To</Text>
          <CustomDropDown
            data={data2}
            label={'Age'}
            style={style.inp}
            pushChange={this._pushChange}
            name={'a2'}
            value={this.state.value.a2}
          />
        </View>
        {this.props.error ? (
          <Text
            style={{
              color: THEME.ERROR_REG,
              paddingHorizontal: 15,
              marginTop: 5,
            }}>
            {this.props.error}
          </Text>
        ) : null}
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  inp: {
    flex: 1,
    marginTop: 0,
    marginHorizontal: 10,
  },
});

export default AgeRange;
