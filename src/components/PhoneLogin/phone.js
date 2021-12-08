import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
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

let countryCodes = [{name: 'ISD', value: 'ISD', code: 'ISD'}, ...countryData];

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

class Phone extends React.Component {
  otpTextInput = [];

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    // this.fromfb = this.props.route.params.linkingFromFB;
    this.phoneNumber = null;
    this.state = {
      code: 'ISD',
      phoneNumber: '',
      otpsent: false,
      otp: new Array(6).fill(''),
      auth: null,
      loading: false,
      verificationId: null,
    };
  }

  componentWillUnmount() {
    this.subscribe && this.subscribe();
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

  loginWithOtpFixed = () => {
    if (this.state.code === 'ISD') {
      alert('Please Select Your Country Code');
      return;
    }
    if (this.state.phoneNumber == '') {
      alert('Please Enter Phone Number');
      return;
    }

    // auth().onAuthStateChanged(this._onAuthChange);
    this.setState({loading: true, otp: new Array(6).fill('')});

    let phone = this.state.code + this.state.phoneNumber;

    auth()
      .verifyPhoneNumber(phone)
      .on(
        'state_changed',
        (phoneAuthSnapshot) => {
          console.log('phoneAuthSnapshot: ', phoneAuthSnapshot);
          console.log('state: ', phoneAuthSnapshot.state);
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
              // on ios this is the final phone auth state event you'd receive
              this.setState({
                verificationId: phoneAuthSnapshot.verificationId,
                otpsent: true,
                loading: false,
              });
              break;
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              if (phoneAuthSnapshot.error.code == 'auth/invalid-phone-number') {
                this.setState({loading: false}, () => {
                  alert('The format of the phone number is invalid');
                });
              } else {
                this.setState({loading: false});
              }
              break;
            // ---------------------
            // ANDROID ONLY EVENTS
            // ---------------------
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
              this.setState({
                otpsent: true,
                verificationId: phoneAuthSnapshot.verificationId,
                loading: false,
              });
              break;
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
              const {verificationId, code} = phoneAuthSnapshot;

              this.setState({otp: code.split(''), loading: true}, () => {
                const credential = firebase.auth.PhoneAuthProvider.credential(
                  verificationId,
                  code,
                );
                firebase
                  .auth()
                  .signInWithCredential(credential)
                  .then((res) => {
                    let {displayName, email, uid, providerId} = res.user;
                    let phone = res.user.phoneNumber;

                    this.props.context
                      .setData({providerId, displayName, email, uid, phone})
                      .then((result) => {
                        this.setState({loading: false});

                        if (result.isDeleted) {
                          alert(
                            'Your profile has been under deletion process.',
                          );
                          auth()
                            .signOut()
                            .then((res) => {
                              this.props.navigation.pop();
                            });
                          return;
                        }

                        // console.log(result)
                        if (result.isRegistered.exists) {
                          this.props.context._checkAuth();
                        } else {
                          this.props.navigation.navigate('Registration', {
                            phoneNumber: phone,
                          });
                        }
                      });
                  })
                  .catch((err) => {
                    this.setState({loading: false});
                    console.log('phone.js err: ', err);
                  });
              });
              break;
          }
        },
        (error) => {
          console.log('phone login err: ', error);
        },
        (phoneAuthSnapshot) => {
          console.log('phoneAuthSnap: ', phoneAuthSnapshot.state);
        },
      );
  };

  confirmOtp = () => {
    console.log('call otp')
    this.setState({loading: true});
    let otp = [...this.state.otp].join('');
    if (otp.length != 6) {
      alert('OTP SHOULD BE OF 6 DIGIT');
      return 0;
    }

    const credential = firebase.auth.PhoneAuthProvider.credential(
      this.state.verificationId,
      otp,
    );

    console.log('credential', credential)
    firebase
      .auth()
      .signInWithCredential(credential)
      .then((res) => {
        console.log('res from firebase', res)
        let {displayName, email, uid, providerId} = res.user;
        let phone = res.user.phoneNumber;

        this.props.context
          .setData({providerId, displayName, email, uid, phone})
          .then((result) => {
            this.setState({loading: false});
            console.log('result', result);

            if (result.isDeleted) {
              alert('Your profile has been under deletion process.');
              auth()
                .signOut()
                .then((res) => {
                  console.log('pop', res)
                  this.props.navigation.pop();
                });
              return;
            }
            if (result.isRegistered.exists) {
              this.props.context._checkAuth();
            } else {
              this.props.navigation.navigate('Registration', {
                phoneNumber: phone,
              });
            }
          }).catch((error) => {
            console.log('props context', error)
        })
      })
      .catch((err) => {
        console.log('error in call', err)
        this.setState({loading: false});
        if (err.code == 'auth/invalid-verification-code') {
          alert('Incorrect verification code.');
        } else {
          alert(err);
        }
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
    return !this.state.otpsent ? (
      <PhoneJSX
        _onPress={this.loginWithOtpFixed}
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
        {this.state.loading ? <Loader isVisible={this.state.loading} /> : null}
      </DermaBackground>
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
            style={{width: '30%', height: 40}}
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

export default Phone;
