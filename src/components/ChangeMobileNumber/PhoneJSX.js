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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();
let countryCodes = [{name: 'ISD', value: 'ISD', code: 'ISD'}, ...countryData];

const PhoneJSX = (props) => (
  <DermaBackground style={{padding: 20}}>
    <Loader isVisible={props.loading} />
    <View
      style={style.phoneLogin}
      onStartShouldSetResponder={() => Keyboard.dismiss()}
      behavior="padding">
      <View>
        <GradientText text={'MOBILE NUMBER'} />
      </View>

      <View style={style.getPhoneNumber}>
        <View style={style.inputs} onStartShouldSetResponder={() => true}>
            {props.mobileNumber ?
                <TouchableOpacity disabled={props.mobileNumber !== '0' ? true : false} onPress={() => props.navigation.navigate('Trust Score')} style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name={'cellphone'} color={'black'} size={25} />
                    <Text style={{fontSize: 20, color: 'blue', marginHorizontal: 10}}>{props.mobileNumber !== '0' ? props.mobileNumber.slice(3).replace(/.(?=.{4,}$)/g, 'X') : 'Link your mobile'}</Text>
                </TouchableOpacity>
                :
                <View>
                    <CountryDrop
                        style={{width: '20%', height: 40}}
                        data={countryCodes}
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
            }
        </View>
        {/*<LinearGradient*/}
        {/*  colors={GRCOLOR}*/}
        {/*  style={style.button}*/}
        {/*  start={{x: 0, y: 0}}*/}
        {/*  end={{x: 1, y: 0}}>*/}
        {/*  <TouchableOpacity*/}
        {/*    onPress={props._onPress}*/}
        {/*    style={{*/}
        {/*      flex: 1,*/}
        {/*      justifyContent: 'center',*/}
        {/*      width: '100%',*/}
        {/*      alignItems: 'center',*/}
        {/*    }}>*/}
        {/*    <Text style={{color: THEME.WHITE}}>CONTINUE</Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*</LinearGradient>*/}
      </View>
    </View>
  </DermaBackground>
);

export default PhoneJSX;
