import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

const DEFAULT_BUTTON = (props) => (
  <LinearGradient
    colors={GRCOLOR}
    style={[style.DEFAULT_BUTTON, props.style]}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}>
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
      }}
      onPress={props._onPress}>
      <Text style={{color: THEME.WHITE}}>{props.text}</Text>
    </TouchableOpacity>
  </LinearGradient>
);

/**
 *
 * @param {text} text -> heading for the header
 * @param {_onPress} _onPress -> onPress Function
 */
const BUTTON_WITH_PARAM = (props) => (
  <LinearGradient
    colors={props.checked ? GRCOLOR : ['#cfd8dc', '#cfd8dc']}
    style={[style.DEFAULT_BUTTON, props.style]}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}>
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        height: '100%',
      }}
      onPress={() => props._onPress(props.pressParam)}>
      <Text style={{color: props.checked ? THEME.WHITE : THEME.GRAY}}>
        {props.text}
      </Text>
    </TouchableOpacity>
  </LinearGradient>
);

const UNBLOCK_BUTTON = (props) => (
  <LinearGradient
    colors={['#fff', '#fff']}
    style={[style.DEFAULT_BUTTON, props.style]}
    start={{x: 0, y: 0}}
    end={{x: 1, y: 0}}>
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
      }}
      onPress={props._onPress}>
      <Text style={{color: THEME.GRADIENT_BG.END_COLOR}}>{props.text}</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const style = StyleSheet.create({
  DEFAULT_BUTTON: {
    width: '50%',
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    borderRadius: 27.5,
  },
});

export default DEFAULT_BUTTON;
export {BUTTON_WITH_PARAM, UNBLOCK_BUTTON};
