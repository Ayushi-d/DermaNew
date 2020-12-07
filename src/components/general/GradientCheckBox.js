import React from 'react';
import {View, TouchableWithoutFeedback, TouchableOpacity, Image} from 'react-native';
import CheckBox from '../../assets/general/ic_checkbox.png';
import THEME from '../../config/theme';


const GradientCheck = (props) => 
  <TouchableOpacity style={{
    width: 20,
    height: 20,
    borderColor: THEME.GRADIENT_BG.START_COLOR,
    borderWidth: (props.isChecked) ? 0 : 2,
    borderRadius: 4
  }}
  onPress={() => props._onPress(props.isChecked, props.from)}
  >
    {
      (props.isChecked)
      ? <Image source={CheckBox} style={{
        resizeMode: 'contain',
        width: 20,
        height: 20
      }}/>
      : null
    }
  </TouchableOpacity>

export default GradientCheck;