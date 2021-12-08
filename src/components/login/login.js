import React from 'react';
import {View, Text, SafeAreaView, StatusBar} from 'react-native';
import DermaBackground from '../general/background';
import Carousel from './carousel';
import LoginAction from './loginActions';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import {Loader} from '../modals';

const LoginJSX = (props) => (
  <DermaBackground>
    <Loader isVisible={props.isVisible} />
    <Carousel />
    <LoginAction
      facebookLogin={props.fblogin}
      toTerms={props.toTerms}
      phoneLogin={props.phoneLogin}
      navigateTo={props.navigateTo}
    />
  </DermaBackground>
);

class Login extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      showLoadingModal: false,
      notificationMessage: null,
      id: null,
    };
  }

  navigateToTerms = () => {
    this.props.navigation.navigate('TermsofUse', {from: 'Login'});
  };

  navigateTo = (route, obj) => {
    this.props.navigation.navigate(route, obj);
  };

  navigateToPhone = () => {
    this.props.navigation.navigate('PhoneLogin');
  };

  facebookLogin = async () => {
    let result;
    try {
      this.setState({showLoadingModal: true});
      LoginManager.setLoginBehavior('NATIVE_ONLY');
      result = await LoginManager.logInWithPermissions([
        'public_profile',
        'user_birthday',
        'email',
      ]);
    } catch (nativeError) {
      try {
        LoginManager.setLoginBehavior('WEB_ONLY');
        result = await LoginManager.logInWithPermissions([
          'public_profile',
          'user_birthday',
          'email',
        ]);
        console.log('result is', result)
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
      // this.firebaseFbAuthentication(accessData.accessToken);
      this.getInfoFromToken(accessData.accessToken);
    }
  };

  getInfoFromToken = async (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id, name, first_name, last_name, birthday, email, picture.type(large), link',
      },
    };
    const profileRequest = new GraphRequest(
        '/me',
        {token, parameters: PROFILE_REQUEST_PARAMS},
        async (error, result) => {
          console.log('result is', result);
          console.log('error is', error);
          if (error) {
            console.log('Login Info has an error:', error);
          } else {
            if (result.isCancelled) {
              console.log('Login cancelled');
            }
            console.log('result of fb', result, token);
            if (result) {
              const facebookCredential = auth.FacebookAuthProvider.credential(
                  token,
              );
              console.log('facebook credential is', facebookCredential);
              this.firebaseFbAuthentication(facebookCredential.token)
            }
          }
        },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  }

  firebaseFbAuthentication = (accessToken) => {
    console.log('test!');
    auth()
      .signInWithCredential(auth.FacebookAuthProvider.credential(accessToken))
      .then((res) => {
        console.log('FB Res: ', res);
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
                  this.props.context._logout();
                });
              return;
            }

            console.log(result);

            if (result.isRegistered.exists) {
              this.props.context._checkAuth();
            } else {
              console.log('register!');
              this.props.navigation.navigate('Registration');
            }
          });
      })
      .catch((err) => alert(err));
  };

  render() {
    return (
      <LoginJSX
        fblogin={this.facebookLogin}
        toTerms={this.navigateToTerms}
        phoneLogin={this.navigateToPhone}
        isVisible={this.state.showLoadingModal}
        navigateTo={this.navigateTo}
      />
    );
  }
}

export default Login;
