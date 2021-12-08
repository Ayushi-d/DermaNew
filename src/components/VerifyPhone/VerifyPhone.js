import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import DermaBackground from '../general/background';
import THEME from '../../config/theme';
import {GradientText} from '../general/gradientText';
import LinearGradient from 'react-native-linear-gradient';
import DropDown from '../general/DropDown';
import countryData from '../../assets/data/countryCodes.json';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import CountryDrop from '../general/countryCode';
import Snackbar from 'react-native-snackbar';
import {Loader} from '../modals';
import LinkAccount from '../../helpers/linkAccount';
import Header from '../Headers/SettingsHeader';

import database from '@react-native-firebase/database';

let countryCodes = [{name: 'ISD', value: 'ISD', code: 'ISD'}, ...countryData];

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

class VerifyPhoneJSX extends React.Component {
  otpTextInput = [];

  constructor(props) {
    super(props);
    // this.fromfb = this.props.route.params.linkingFromFB;
    this.phoneNumber = null;
    this.state = {
      code: '+91',
      phoneNumber: '',
      otpsent: false,
      otp: new Array(6).fill(''),
      auth: null,
      loading: false,
      verificationId: null,
    };
  }

  setRefToPhone = (input) => {
    this.phoneNumber = input;
  };

  onPhoneChange = (text) => {
    this.setState({phoneNumber: text});
  };

  codeChange = (text) => {
    this.setState({code: text});
  };

  loginWithOtp = async () => {
    if (this.state.code === 'ISD') {
      alert('Please Select Your Country Code');
      return;
    }
    if (this.state.phoneNumber == '') {
      alert('Please Enter Phone Number');
      return;
    }
    this.setState({loading: true, otp: new Array(6).fill('')});

    let phone = this.state.code + this.state.phoneNumber;

    let check = await database()
      .ref(`Users`)
      .orderByChild('cn')
      .equalTo(phone)
      .once('value')
      .catch((err) => {
        console.log('ChangeMobileNumber.js: loginWithOtp: err: ', err);
        this.setState({loading: false});
        Alert.alert('Something Went Wrong!');
      });
    if (check.exists()) {
      Alert.alert('Phone Number already linked to another account!');
      this.setState({loading: false});

      return;
    }

    auth()
      .verifyPhoneNumber(phone)
      .then((res) => {
        Snackbar.show({
          text: 'OTP SENT',
          duration: Snackbar.LENGTH_SHORT,
        });

        this.setState({
          verificationId: res.verificationId,
          otpsent: true,
          loading: false,
        });
      })
      .catch((err) => {
        console.log('error in', err);
        this.setState({loading: false});
      });
  };

  confirmOtp = () => {
    console.log('confirm otp call')
    let phone = this.state.code + this.state.phoneNumber;
    this.setState({loading: true});
    let otp = [...this.state.otp].join('');
    if (otp.length != 6) {
      alert('OTP SHOULD BE OF 6 DIGIT');
      this.setState({loading: false});
      return 0;
    }

    LinkAccount.withPhone(this.state.verificationId, otp)
      .then((res) => {
        console.log('link account with my phone', res);
        // update ts
        // update mobile score

        this.props.context.verifyPhone(phone).then((res) => {
          if (res) {
            this.props.context.updateTSBy20().then((res) => {
              console.log('response entetw', res);
              if (res) {
                this.setState({loading: false}, () => {
                  console.log('back back')
                  this.props.navigation.goBack();
                });
              }
            });
          }
        });
      })
      .catch((err) => {
        console.log('error in confirm otp', err)
        this.setState({loading: false});
      });
  };

  changeMobileNumber = () => {
    this.setState({otpsent: false});
  };

  renderOtp = () => {
    const inputs = Array(6).fill(0);
    const txt = inputs.map((i, j) => (
      <TextInput
        style={style.otp}
        keyboardType="numeric"
        onChangeText={(v) => this.focusNext(j, v)}
        onKeyPress={(e) => this.focusPrevious(e.nativeEvent.key, j)}
        ref={(ref) => (this.otpTextInput[j] = ref)}
        key={j}
        value={this.state.otp[j]}
      />
    ));
    return txt;
  };

  focusPrevious = (key, index) => {
    if (key === 'Backspace' && index !== 0 && this.state.otp[index].length == 0)
      this.otpTextInput[index - 1].focus();
  };

  focusNext = (index, value) => {
    if (index < this.otpTextInput.length - 1 && value) {
      this.otpTextInput[index + 1].focus();
    }
    if (index === this.otpTextInput.length - 1 && value.length == 1) {
      this.otpTextInput[index].blur();
    }

    if (value.length > 1) {
      return;
    }

    const otp = this.state.otp;
    otp[index] = value;
    this.setState({otp});
  };

  render() {
    return (
      <>
        <Header title={'Verify Phone'} {...this.props} />
        {!this.state.otpsent ? (
          <PhoneJSX
            _onPress={this.loginWithOtp}
            codeChange={this.codeChange}
            onPhoneChange={this.onPhoneChange}
            phoneValue={this.state.phoneNumber}
            defaultCode={this.state.code}
            loading={this.state.loading}
          />
        ) : (
          <DermaBackground style={{padding: 20}}>
            <View
              style={style.phoneLogin}
              onStartShouldSetResponder={() => Keyboard.dismiss()}
              behavior="padding">
              <View>
                <GradientText text={'MOBILE NUMBER'} />
              </View>
              <View style={style.otpContainer}>
                <Text style={style.heading}>Verify Mobile Number</Text>
                <Text style={style.para}>
                  Enter the 6 - digit code sent to your mobile number
                </Text>

                <View style={style.grid}>{this.renderOtp()}</View>
                <View style={{alignItems: 'center', marginTop: 30}}>
                  <LinearGradient
                    colors={GRCOLOR}
                    style={style.submitOtp}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        width: '100%',
                        alignItems: 'center',
                      }}
                      onPress={this.confirmOtp}>
                      <Text style={{color: THEME.WHITE}}>SUBMIT</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
                <Text style={style.links} onPress={this.loginWithOtp}>
                  Re-send Code
                </Text>
                <Text style={style.links} onPress={this.changeMobileNumber}>
                  Change Mobile Number
                </Text>
              </View>
            </View>
            <Loader isVisible={this.state.loading} />
          </DermaBackground>
        )}
      </>
    );
  }
}

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
        <LinearGradient
          colors={GRCOLOR}
          style={style.button}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <TouchableOpacity
            onPress={props._onPress}
            style={{
              flex: 1,
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
            }}>
            <Text style={{color: THEME.WHITE}}>CONTINUE</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  </DermaBackground>
);

const style = StyleSheet.create({
  phoneLogin: {
    backgroundColor: THEME.WHITE,
    flex: 1,
    borderRadius: 20,
    padding: 10,
  },
  getPhoneNumber: {
    flex: 1,
    alignItems: 'center',
  },
  inputs: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: '50%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  number: {
    width: '80%',
  },
  button: {
    width: '50%',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 30,
  },

  submitOtp: {
    width: '50%',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
  },
  otp: {
    borderWidth: 1,
    width: 50,
    height: 50,
    borderColor: THEME.BORDERCOLOR,
    borderRadius: 2,
    paddingHorizontal: 20,
  },
  otpContainer: {
    flex: 1,
    marginTop: 20,
  },
  heading: {
    color: THEME.HEADING,
    fontSize: 18,
    marginBottom: 20,
  },
  para: {
    color: THEME.PARAGRAPH,
    fontSize: 14,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '10%',
  },
  links: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: THEME.LINKS,
    marginTop: 20,
  },
});

const VerifyPhone = (props) => <VerifyPhoneJSX {...props} />;

export default VerifyPhone;
