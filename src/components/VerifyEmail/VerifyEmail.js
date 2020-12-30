import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  NativeModules,
} from 'react-native';
import DermaBackground from '../general/background';
import THEME from '../../config/theme';
import {GradientText} from '../general/gradientText';
import LinearGradient from 'react-native-linear-gradient';
import Snackbar from 'react-native-snackbar';
import {Loader} from '../modals';
import {SENDGRID_API_KEY} from 'react-native-dotenv';
import sendGridEmail from '../../helpers/sendgrid';

import Header from '../Headers/SettingsHeader';

const GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

class VerifyEmailJSX extends React.Component {
  otpTextInput = [];

  constructor(props) {
    super(props);
    this.phoneNumber = null;
    this.state = {
      email: (this.props.context.user && this.props.context.user.em) || '',
      otpsent: false,
      otp: new Array(6).fill(''),
      auth: null,
      loading: false,
      verificationId: null,
    };
  }

  emailChange = (text) => {
    this.setState({email: text});
  };

  codeChange = (text) => {
    this.setState({code: text});
  };

  loginWithOtp = () => {
    if (this.state.email == '') {
      alert('Please Enter Email Address');
      return;
    }

    let email = this.state.email;

    let re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      alert('This is not a valid email address.');
      return;
    }
    let em = this.generateEmail(email);

    this.setState({loading: true, otp: new Array(6).fill('')}, () => {
      sendGridEmail(SENDGRID_API_KEY, em.to, em.from, em.subject, em.text)
        .then((res) => {
          if (res) {
            this.setState({loading: false, otpsent: true}, () => {
              Snackbar.show({
                text: 'OTP SENT',
                duration: Snackbar.LENGTH_SHORT,
              });
            });
          }
        })
        .catch((err) => {
          Snackbar.show({
            text: err,
            duration: Snackbar.LENGTH_SHORT,
          });
        });
    });
  };

  generateEmail = (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    this.setState({verificationId: otp});
    const msg = {
      to: email,
      from: 'verification@dermacupid.com',
      subject: 'Email Verification',
      text: `Dear User,\n\nThe OTP to verify Email address for your Derma Cupid account is ${otp}.\n\nNote: - This is a system-generated e-mail, please don't reply to this message.\n\nFor any help, please contact us on the below customer support helpline.\n\nThank you,\nTeam Dermacupid\nsupport@dermacupid.com`,
    };

    return msg;
  };

  confirmOtp = () => {
    this.setState({loading: true});
    let otp = [...this.state.otp].join('');
    if (otp.length != 6) {
      alert('OTP SHOULD BE OF 6 DIGIT');
      return 0;
    }

    // check otp

    let sentOtp = this.state.verificationId;

    if (parseInt(sentOtp) == parseInt(otp)) {
      this.props.context.verifyEmail(this.state.email).then((res) => {
        if (res) {
          this.props.context.updateTSBy20().then((res) => {
            if (res) {
              this.setState({loading: false}, () => {
                this.props.navigation.goBack();
              });
            }
          });
        }
      });
    } else {
      this.setState({loading: false}, () => {
        Snackbar.show({
          text: 'WRONG OTP',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
    }
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
        <Header title={'Verify Email'} {...this.props} />
        {!this.state.otpsent ? (
          <PhoneJSX
            _onPress={this.loginWithOtp}
            codeChange={this.codeChange}
            onEmailChange={this.emailChange}
            emailValue={this.state.email}
            loading={this.state.loading}
          />
        ) : (
          <DermaBackground style={{padding: 20}}>
            <View
              style={style.phoneLogin}
              onStartShouldSetResponder={() => Keyboard.dismiss()}
              behavior="padding">
              <View>
                <GradientText text={'EMAIL ADDRESS'} />
              </View>
              <View style={style.otpContainer}>
                <Text style={style.heading}>Verify Email Address</Text>
                <Text style={style.para}>
                  Enter the 6 - digit code sent to your email id
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
                <Text style={style.text}>
                  Didn't receive code? Check spam folder also.
                </Text>
                <Text style={style.links} onPress={this.loginWithOtp}>
                  Re-send Code
                </Text>
                <Text style={style.links} onPress={this.changeMobileNumber}>
                  Change Email Address
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
        <GradientText text={'EMAIL ADDRESS'} />
      </View>

      <View style={style.getPhoneNumber}>
        <View style={style.inputs} onStartShouldSetResponder={() => true}>
          <TextInput
            style={{...style.input, ...style.number}}
            onChangeText={props.onEmailChange}
            keyboardType={'email-address'}
            value={props.emailValue}
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
    width: '100%',
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
  text: {
    textAlign: 'center',
    color: THEME.PARAGRAPH,
    marginTop: 20,
  },
});

const VerifyEmail = (props) => <VerifyEmailJSX {...props} />;

export default VerifyEmail;
