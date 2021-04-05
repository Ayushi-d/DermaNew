import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import FacebookLogo from '../../assets/login/ic_facebook.png';
import HelpIcon from '../../assets/login/ic_help.png';
import THEME from '../../config/theme';
import HelpInfo from '../modals/help';
import phone from '../../assets/login/ic_phone.png';
import {normalize} from './getScale';

const FacebookButton = (props) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      maxWidth: '100%',
    }}>
    <View style={[loginAction.button]}>
      <TouchableOpacity style={[loginAction.fb]} onPress={props.onPress}>
        <View
          style={{flexDirection: 'row', marginRight: 20, alignItems: 'center'}}>
          <Image
            source={FacebookLogo}
            style={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
              marginRight: 20,
            }}
          />
          <View
            style={{
              height: 30,
              width: 1,
              borderColor: 'white',
              backgroundColor: 'white',
            }}
          />
        </View>
        <Text
          style={{
            color: THEME.WHITE,
            fontWeight: '600',
            fontSize: normalize(12),
          }}>
          CONTINUE WITH FACEBOOK
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={{
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onPress={props.toggleHelp}>
      <Image
        source={HelpIcon}
        style={{
          height: 20,
          width: 20,
          resizeMode: 'contain',
          borderWidth: 1,
        }}
      />
    </TouchableOpacity>
  </View>
);

const PhoneButton = (props) => (
  <View style={[loginAction.button, {marginBottom: 20}]}>
    <TouchableOpacity
      onPress={props.phoneLogin}
      style={{
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <Image
        source={phone}
        style={{
          height: 30,
          width: 30,
          resizeMode: 'contain',
          marginRight: 20,
        }}
      />

      <Text
        style={{
          color: THEME.WHITE,
          fontSize: normalize(12),
        }}>
        CONTINUE WITH PHONE NUMBER
      </Text>
    </TouchableOpacity>
  </View>
);

const ContactUs = (props) => (
  <View style={loginAction.contactUs}>
    <Text
      style={{...loginAction.loginText, ...loginAction.underline}}
      onPress={() =>
        props.navigateTo('Help Screen', {
          hideHeader: true,
          from: 'Login',
        })
      }>
      Contact Us
    </Text>
  </View>
);

const TermsConditions = (props) => (
  <View style={loginAction.terms}>
    <Text style={loginAction.loginText}>
      By Tapping continue you agree with our
    </Text>
    <View style={loginAction.privacy}>
      <Text
        style={{...loginAction.loginText, ...loginAction.underline}}
        onPress={props.terms}>
        Terms of Use
      </Text>
      <Text style={loginAction.loginText}> & </Text>
      <Text
        style={{...loginAction.loginText, ...loginAction.underline}}
        onPress={() => props.navigateTo('PrivacyPolicy', {from: 'Login'})}>
        Privacy Policy
      </Text>
    </View>
  </View>
);

class LoginAction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelpInfo: false,
    };
  }

  toggleHelpInfo = () => {
    this.setState({showHelpInfo: !this.state.showHelpInfo});
  };

  render() {
    return (
      <View style={loginAction.container}>
        <FacebookButton
          onPress={this.props.facebookLogin}
          toggleHelp={this.toggleHelpInfo}
        />
        <PhoneButton phoneLogin={this.props.phoneLogin} />
        <ContactUs navigateTo={this.props.navigateTo} />
        <TermsConditions
          terms={this.props.toTerms}
          navigateTo={this.props.navigateTo}
        />
        {this.state.showHelpInfo ? (
          <HelpInfo
            isVisible={this.state.showHelpInfo}
            toggleHelpInfo={this.toggleHelpInfo}
          />
        ) : null}
      </View>
    );
  }
}

const loginAction = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  button: {
    flexDirection: 'row',
    height: 50,
    borderColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: THEME.LOGINBUTTON,
    borderRadius: 25,
    width: '75%',
    marginLeft: Dimensions.get('window').width * (25 / 200),
  },
  fb: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  terms: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  contactUs: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },

  loginText: {
    color: THEME.WHITE,
    fontSize: 14,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  privacy: {
    flexDirection: 'row',
  },
});

export default LoginAction;
