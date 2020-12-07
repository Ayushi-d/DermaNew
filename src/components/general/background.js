import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import THEME from '../../config/theme';
import LinearGradient from 'react-native-linear-gradient';

const DermaBackground = (props) =>
  <LinearGradient colors={THEME.GRADIENT_BG.PAIR} style={{ ...style.view, ...props.style }}>
    <StatusBar barStyle="dark-content" backgroundColor={THEME.GRADIENT_BG.START_COLOR} />
    {
      props.children
    }
  </LinearGradient>


export default DermaBackground;

const style = StyleSheet.create({
  view: {
    flex: 1,
  }
})