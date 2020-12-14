import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  TextInput,
  HelperText,
  Button,
  Headline,
  Title,
} from 'react-native-paper';
import {Input, Item, Icon, Picker} from 'native-base';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import countryCodes from '../../assets/countryCodes.json';
import Carousel from './carousel';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DermaBackground from '../../components/general/background';
import THEME from '../../config/theme';

import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import {Loader} from '../../components/modals';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      pswd: '',
      showLoadingModal: false,
      notificationMessage: null,
      id: null,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  _loginBtn = () => {};

  facebookLogin = async () => {
    let result;
    try {
      this.setState({showLoadingModal: true});
      LoginManager.setLoginBehavior('NATIVE_ONLY');
      result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
    } catch (nativeError) {
      try {
        LoginManager.setLoginBehavior('WEB_ONLY');
        result = await LoginManager.logInWithPermissions([
          'public_profile',
          'email',
        ]);
      } catch (webError) {}
    }
    // handle the case that users clicks cancel button in Login view
    if (result.isCancelled) {
      this.setState({
        showLoadingModal: false,
        notificationMessage: 'cancelled',
      });
    } else {
      const accessData = await AccessToken.getCurrentAccessToken();
      this.firebaseFbAuthentication(accessData.accessToken);
    }
  };

  firebaseFbAuthentication = (accessToken) => {
    auth()
      .signInWithCredential(
        firebase.auth.FacebookAuthProvider.credential(accessToken),
      )
      .then((res) => {
        let {providerId} = res.additionalUserInfo;
        let {displayName, email, uid} = res.user;
        this.props.context
          .setData({providerId, displayName, email, uid})
          .then((result) => {
            this.setState({showLoadingModal: false});

            if (result.isDeleted) {
              alert('Your profile has been under deletion process.');
              auth()
                .signOut()
                .then((res) => {
                  this.props.context._logOut();
                });
              return;
            }

            if (result.isRegistered) {
              this.props.context._checkAuth();
            } else {
              this.props.navigation.navigate('Registration');
            }
          });
      })
      .catch((err) => alert(err));
  };

  render() {
    let {navigation} = this.props;
    let {showLoadingModal} = this.state;
    return (
      <DermaBackground>
        <Carousel />

        <View style={{...styles.container}}>
          <LoginBtn
            icon={
              <AntDesign name={'facebook-square'} color={'#fff'} size={27} />
            }
            title={'CONTINUE WITH FACEBOOK'}
            onPress={this.facebookLogin}
          />

          <LoginBtn
            icon={
              <Ionicons
                name={'ios-phone-portrait-outline'}
                color={'#fff'}
                size={27}
              />
            }
            title={'CONTINUE WITH PHONE NUMBER'}
            style={{marginTop: 20}}
            onPress={() => navigation.push('PhoneLogin')}
          />

          <Text
            style={{...styles.extraTxt, ...styles.txtBtn, marginTop: 20}}
            onPress={() => {}}>
            Contact Us
          </Text>

          <Text style={{...styles.extraTxt, marginTop: 20}}>
            By Tapping continue you agree with our
          </Text>
          <Text style={{...styles.extraTxt}}>
            <Text style={{...styles.txtBtn}} onPress={() => {}}>
              Terms of Use
            </Text>{' '}
            &{' '}
            <Text style={{...styles.txtBtn}} onPress={() => {}}>
              Privacy Policy
            </Text>
          </Text>
        </View>
        <Loader isVisible={showLoadingModal} />
      </DermaBackground>
    );
  }
}

function LoginBtn(props) {
  return (
    <TouchableOpacity
      style={{...styles.loginBtn, ...props.style}}
      onPress={props.onPress}>
      {props.icon}
      <Text style={{...styles.loginBtnTxt}}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 30,
  },
  loginBtn: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    paddingHorizontal: 25,
    width: '80%',
    backgroundColor: THEME.LOGINBUTTON,
    borderRadius: 25,
  },
  loginBtnTxt: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
    color: THEME.WHITE,
  },
  extraTxt: {
    color: THEME.WHITE,
    fontSize: 13,
  },
  txtBtn: {
    textDecorationLine: 'underline',
    textDecorationColor: THEME.WHITE,
  },
});
