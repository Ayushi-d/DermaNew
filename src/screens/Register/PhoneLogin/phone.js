import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import DermaBackground from '../../../components/general/background';
import THEME from '../../../config/theme';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Title} from 'native-base';
import countryCodes from '../../../assets/countryCodes.json';
import LinearGradient from 'react-native-linear-gradient';

import CountryModal from './countryModal';

import {GradientText} from '../../../components/general/gradientText';

import auth from '@react-native-firebase/auth';
import {Loader} from '../../../components/modals';

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

export default class Phone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: '🇮🇳 +91',
      code: '+91',
      phoneNumber: '',
      otp: '',
      otpsent: false,
      auth: null,
      loading: false,
      verificationId: null,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this.phone &&
      this.setState({
        pickerData: this.phone.getPickerData(),
      });
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loginWithOtpFixed = () => {
    console.log('login');
    if (this.state.phoneNumber == '') {
      alert('Please Enter Phone Number');
      return;
    }
    this.setState({loading: true, otp: new Array(6).fill('')});

    let phone = this.state.code + this.state.phoneNumber;
    auth()
      .verifyPhoneNumber(phone)
      .on(
        'state_changed',
        (phoneAuthSnapshot) => {
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case auth.PhoneAuthState.CODE_SENT: // or 'sent'
              // on ios this is the final phone auth state event you'd receive
              this.setState({
                verificationId: phoneAuthSnapshot.verificationId,
                otpsent: true,
                loading: false,
              });
              break;
            case auth.PhoneAuthState.ERROR: // or 'error'
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
            case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
              this.setState({
                otpsent: true,
                verificationId: phoneAuthSnapshot.verificationId,
                loading: false,
              });
              break;
            case auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
              const {verificationId, code} = phoneAuthSnapshot;

              this.setState({otp: code.split(''), loading: true}, () => {
                const credential = auth.PhoneAuthProvider.credential(
                  verificationId,
                  code,
                );
                this._completeSignIn(credential);
              });
              break;
          }
        },
        (error) => {
          console.log('Error login:', error);
        },
        (phoneAuthSnapshot) => {},
      );
  };

  _completeSignIn = (credential) => {
    auth()
      .signInWithCredential(credential)
      .then((res) => {
        let {displayName, email, uid, providerId} = res.user;
        let phone = res.user.phoneNumber;
        let user = {
          providerId,
          displayName,
          email,
          uid,
          phone,
        };
        this.props.context.setLoginUser(user).then((result) => {
          this.setState({loading: false});

          if (result.isDeleted) {
            alert('Your profile has been under deletion process.');
            auth()
              .signOut()
              .then((res) => {
                this.props.navigation.pop();
              });
            return;
          }

          if (result.isRegistered) {
            // this.props.navigation.navigate('Drawer');
            this.props.context._checkAuth();
          } else {
            this.props.navigation.navigate('Registration', {
              phoneNumber: phone,
            });
          }
        });
      })
      .catch((err) => {
        this.setState({loading: false}, () => {
          console.log(err);
        });
      });
  };

  loginWithOtp = () => {
    if (this.state.phoneNumber == '') {
      alert('Please Enter Phone Number');
      return;
    }
    this.setState({loading: false, otp: new Array(6).fill('')});

    let phone = this.state.code + this.state.phoneNumber;

    auth()
      .signInWithPhoneNumber(phone, true)
      .then((res) => {
        this.setState({auth: res, otpsent: true, loading: false});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  confirmOtp = () => {
    this.setState({loading: true});
    // let otp = [...this.state.otp].join('');
    let {otp} = this.state;
    if (otp.length != 6) {
      alert('OTP SHOULD BE OF 6 DIGIT');
      this.setState({loading: false});

      return 0;
    }

    const credential = auth.PhoneAuthProvider.credential(
      this.state.verificationId,
      otp,
    );
    auth()
      .signInWithCredential(credential)
      .then((res) => {
        let {displayName, email, uid, providerId} = res.user;
        let phone = res.user.phoneNumber;
        let user = {providerId, displayName, email, uid, phone};

        this.props.context._setLoginUser(user).then((result) => {
          this.setState({loading: false});

          if (result.isDeleted) {
            alert('Your profile has been under deletion process.');
            auth()
              .signOut()
              .then((res) => {
                this.props.navigation.navigate('Login');
              });
            return;
          }
          if (result.isRegistered) {
            // this.props.navigation.navigate('Drawer');
            this.props.context._checkAuth();
          } else {
            this.props.navigation.navigate('Registration', {
              phoneNumber: phone,
            });
          }
        });
      })
      .catch((err) => {
        this.setState({loading: false}, () => {
          if (err.code == 'auth/invalid-verification-code') {
            alert('Incorrect verification code.');
          } else {
            alert(err);
          }
        });
      });
  };

  changeMobileNumber = () => {
    this.setState({otpsent: false});
  };

  _onPressFlag = () => {
    this.countryModal.openModal();
  };

  _selectCountry = (country) => {
    // console.log(country);
    this.setState({
      code: country.dial_code,
      country: `${country.flag} ${country.dial_code}`,
    });
  };

  _renderPhone = () => {
    let {country, phoneNumber} = this.state;
    let codes = [];
    countryCodes.map((code) =>
      codes.push({
        label: code.dial_code + ' (' + code.name + ')',
        value: code.dial_code,
      }),
    );
    return (
      <View style={{...styles.container, alignItems: 'center'}}>
        {/* <Title style={{color: '#000'}}>PHONE NUMBER</Title> */}
        <GradientText text={'MOBILE NUMBER'} />

        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#888',
            borderRadius: 4,
            marginTop: 100,
          }}>
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 12,
            }}
            onPress={this._onPressFlag}>
            <Text style={{fontSize: 16}}>{country}</Text>
          </Pressable>

          <TextInput
            placeholder={'Phone Number'}
            value={phoneNumber}
            onChangeText={(phoneNumber) => this.setState({phoneNumber})}
            style={{
              flex: 1,
              borderLeftWidth: 0.5,
              borderColor: '#888',
              paddingLeft: 14,
            }}
            maxLength={10}
            multiline={false}
            keyboardType={'number-pad'}
          />
        </View>

        <CountryModal
          ref={(ref) => (this.countryModal = ref)}
          onPress={this._selectCountry}
        />

        <LinearGradient
          colors={GRCOLOR}
          style={styles.button}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'center',
              width: '100%',
              alignItems: 'center',
            }}
            disabled={phoneNumber.length < 10}
            onPress={this.loginWithOtpFixed}>
            <Text style={{color: THEME.WHITE}}>CONTINUE</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  _renderOTP = () => {
    return (
      <>
        {/* <View style={{alignItems: 'center', justifyContent:'center'}}>
            <Ionicons name={"ios-phone-portrait-outline"} color={"#fff"} size={117} />
            </View> */}
        <View style={{...styles.container}}>
          {/* <Title style={{color: '#000'}}>VERIFY OTP</Title> */}
          <GradientText text={'MOBILE NUMBER'} />
          <OTPInputView
            pinCount={6}
            autoFocusOnLoad
            codeInputFieldStyle={{...styles.borderStyleBase, color: '#000'}}
            codeInputHighlightStyle={{...styles.borderStyleHighLighted}}
            style={{height: 100, marginTop: 150, alignItems: 'center'}}
            onCodeChanged={(otp) => {
              this.setState({otp});
              // console.log(otp);
            }}
            // onCodeFilled={this.confirmOtp}
          />

          <View style={{width: '100%', alignItems: 'center'}}>
            <LinearGradient
              colors={GRCOLOR}
              style={styles.button}
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
                <Text style={{color: THEME.WHITE}}>CONTINUE</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </>
    );
  };

  render() {
    let {otpsent, loading} = this.state;
    return (
      <DermaBackground>
        <View style={{flex: 1, padding: 25}}>
          {otpsent ? this._renderOTP() : this._renderPhone()}
        </View>
        <Loader isVisible={loading} />
      </DermaBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 200,
    // marginTop: 30,
    backgroundColor: '#fff',
    // borderRadius: 15,
    padding: 20,
    borderRadius: 10,
  },
  borderStyleBase: {
    width: 40,
    height: 40,
    borderColor: '#888',
  },
  borderStyleHighLighted: {
    borderColor: '#111',
  },
  countryInput: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 2,
  },

  button: {
    width: '50%',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    borderRadius: 20,
    marginTop: 30,
  },
});
