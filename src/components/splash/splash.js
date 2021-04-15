import React from 'react';
import SplashBackground from '../../assets/splash/splash_screen.png';
import DermaLogo from '../../assets/splash/dc_logo.png';
import Name from './name';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import CheckUser from '../../helpers/login';

import {NavigationActions, StackActions} from 'react-navigation';

class Splash extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.checkAuthentication();
  }

  checkAuthentication = async () => {
    let user = auth().currentUser;
    // console.log(user);
    if (user) {
      try {
        let isRegistered = await CheckUser.isRegistered(user.uid);
        let isDeleted = await CheckUser.isDeleted(user.uid);

        // console.log(isRegistered, isDeleted);

        if (isDeleted) {
          await auth().signOut();
          this.props.navigation.navigate('Login');
          return;
        }

        if (isRegistered.exists) {
          this.props.context._setLoginUser(isRegistered.user);
          this.props.navigation.navigate('Drawer');
          this.props._loginCheck(true);
        } else {
          this.props.navigation.navigate('Login');
        }
      } catch (error) {
        console.log(error);
        this.props.navigation.navigate('Login');
      }
    } else {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    return (
      <ImageBackground source={SplashBackground} style={style.image}>
        <StatusBar barStyle="dark-content" backgroundColor="#FC6E4F" />
        {/* <Image source={DermaLogo} style={style.logo} /> */}
        {/* <View style={style.horizontalLine} /> */}
        {/* <Name /> */}
      </ImageBackground>
    );
  }
}

const style = StyleSheet.create({
  image: {
    flex: 1,
    position: 'relative',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: '40%',
    resizeMode: 'contain',
  },

  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1.5,
    marginTop: 10,
    width: '40%',
    borderRadius: 1,
  },
});

export default Splash;
