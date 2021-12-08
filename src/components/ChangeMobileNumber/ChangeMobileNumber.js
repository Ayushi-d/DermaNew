import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Settings,
} from 'react-native';
import DermaBackground from '../general/background';
import THEME from '../../config/theme';
import {GradientText} from '../general/gradientText';
import LinearGradient from 'react-native-linear-gradient';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import {Loader} from '../modals';
import LinkAccount from '../../helpers/linkAccount';

import style from './style';
import PhoneJSX from './PhoneJSX';
import database from '@react-native-firebase/database';
import SettingsHeader from '../Headers/SettingsHeader';
import {Alert} from 'react-native';

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

class ChangeMobileNumberJSX extends React.Component {
  otpTextInput = [];

  constructor(props) {
    super(props);
    // this.fromfb = this.props.navigation.getParam('linkingFromFB');
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
        .limitToFirst(1)
        .limitToLast(20)
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
      .on(
        'state_changed',
        (phoneAuthSnapshot) => {
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
              // on ios this is the final phone auth state event you'd receive
              this.setState(
                {
                  verificationId: phoneAuthSnapshot.verificationId,
                  otpsent: true,
                  loading: false,
                },
                () => {
                  alert('OTP has been sent successfully');
                },
              );
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
                // change mobile number here
                auth()
                  .currentUser.updatePhoneNumber(credential)
                  .then((res) => {
                    this.setState(
                      {
                        loading: false,
                      },
                      () => {
                        alert('Mobile Number changed successfully!');
                        this.props.navigation.goBack();
                      },
                    );
                  })
                  .catch((err) => {
                    this.setState(
                      {
                        loading: false,
                      },
                      () => {
                        if (err.code == 'auth/credential-already-in-use') {
                          alert('Mobile number is already in use.');
                        }
                        this.props.navigation.goBack();
                      },
                    );
                  });
              });
              break;
          }
        },
        (error) => {},
        (phoneAuthSnapshot) => {},
      );
  };

  confirmOtp = () => {
    console.log('here in the change mobile number');
    let currentUser = auth().currentUser;
    let phone = this.state.code + this.state.phoneNumber;
    // yet to implement
    this.setState({loading: true});
    let otp = [...this.state.otp].join('');
    if (otp.length != 6) {
      alert('OTP SHOULD BE OF 6 DIGIT');
      this.setState({loading: false});
      return 0;
    }

    const credential = firebase.auth.PhoneAuthProvider.credential(
      this.state.verificationId,
      otp,
    );

    auth()
      .currentUser.updatePhoneNumber(credential)
      .then((res) => {
        let ref = database().ref(`/Users/${currentUser.uid}`);

        ref
          .child('cn')
          .set(phone)
          .then((res) => {
            this.setState(
              {
                loading: false,
              },
              () => {
                alert('Mobile Number changed successfully!');
                this.props.navigation.goBack();
              },
            );
          })
          .catch((err) => {
            this.setState({loading: false}, () => {
              alert('Error updating mobile number');
              this.props.navigation.goBack();
            });
          });
      })
      .catch((err) => {
        this.setState(
          {
            loading: false,
          },
          () => {
            if (err.code == 'auth/credential-already-in-use') {
              alert('Mobile number is already in use.');
              return;
            }

            if (err.code == 'auth/invalid-verification-code') {
              alert('Otp is incorrect');
              return;
            }

            alert('Some error occurred');
            this.props.navigation.goBack();
          },
        );
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
    console.log('this.props is', this.props);
    return (
      <>
        <SettingsHeader title={'Your Contact Details'} {...this.props} />
        {!this.state.otpsent ? (
          <PhoneJSX
            _onPress={this.loginWithOtp}
            codeChange={this.codeChange}
            navigation={this.props.navigation}
            onPhoneChange={this.onPhoneChange}
            phoneValue={this.state.phoneNumber}
            defaultCode={this.state.code}
            loading={this.state.loading}
            mobileNumber={this.props.context.user.cn}
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
            {this.state.loading ? (
              <Loader isVisible={this.state.loading} />
            ) : null}
          </DermaBackground>
        )}
      </>
    );
  }
}

const ChangeMobileNumber = (props) => <ChangeMobileNumberJSX {...props} />;

export default ChangeMobileNumber;
