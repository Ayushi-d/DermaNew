import React from 'react';
import CountryDrop from '../general/countryCode';
import {TextInput, TouchableOpacity, View, Text, Keyboard} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import THEME from '../../config/theme';
import {Loader} from '../modals';
import DermaBackground from '../general/background';
import {GradientText} from '../general/gradientText';
import countryData from '../../assets/data/countryCodes.json';
const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

const PhoneJSX = props => (
  <DermaBackground style={{padding: 20}}>
    <Loader isVisible={props.loading} />
    <View
      style={style.phoneLogin}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
      behavior="padding"
    >
      <View>
        <GradientText text={'MOBILE NUMBER'} />
      </View>

      <View style={style.getPhoneNumber}>
        <View style={style.inputs} onStartShouldSetResponder={() => true}>
          <CountryDrop
            style={{width: '20%', height: 40}}
            data={countryData}
            defaultValue={props.defaultCode}
            pushChange={props.codeChange}
          />
          <TextInput
            style={{...style.input, ...style.number}}
            onChangeText={props.onPhoneChange}
            keyboardType={'numeric'}
            value={props.phoneValue}
            ref={props.setPhone}
          />
        </View>
        <LinearGradient
          colors={GRCOLOR}
          style={style.button}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        >
          <TouchableOpacity
            onPress={props._onPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Text style={{color: THEME.WHITE}}>CONTINUE</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  </DermaBackground>
);

export default PhoneJSX;
