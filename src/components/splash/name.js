import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import THEME from '../../config/theme';

export default Name = () => (
  <View style={style.view}>
    <Text style={style.white}>DERMA </Text>
    <Text style={style.black}>CUPID </Text>
  </View>
);

const style = StyleSheet.create({
  view: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
  white: {
    color: 'white',
    fontSize: 26,
    marginRight: 20,
    fontWeight: '800',
    textAlign: 'right',
  },
  black: {
    color: 'black',
    fontSize: 26,
    fontWeight: '800',
  },
});
