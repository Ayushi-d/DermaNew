import React from 'react';
import {View, StatusBar, Text} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Registration from '../screens/Register/register';
import Login from '../screens/Register/login';
import PhoneLogin from '../screens/Register/PhoneLogin';
import {Appbar} from 'react-native-paper';

import CheckUser from '../helpers/login';

import RegistrationHOC, {RegistrationContext} from '../context/registration';

// DrawerStack
import SideBar from './Drawer';

// import Dashboard from '../screens/DrawerStack/Dashboard';
import Dashboard from '../components/dashboard';

import DHeader from '../components/Headers/DrawerStackHeader';

import Splash from '../components/splash';

import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import MyMatches from '../components/MyMatches';
import LikesScreen from '../screens/DrawerStack/LikeScreen';
import LikesSentScreen from '../screens/DrawerStack/LikeSent';

// import Search, {SearchResult} from '../components/search';
import Search, {SearchResult} from '../components/search';

// SETTINGS NAV
import Settings from '../components/Setting';
import BlockedUser from '../components/Setting/BlockedUsers';
import ChangeMobileNumber from '../components/ChangeMobileNumber/';
import DeleteProfile from '../components/Setting/DeleteProfile';
import PrivacyPolicy from '../components/Setting/PrivacyPolicy';
import TermsOfUse from '../components/login/terms';
import SafetyGuidelines from '../components/Setting/SafetyGuideline';
import Help from '../components/Setting/help';
import FAQs from '../components/Setting/faqs';

// Profile
import MyProfile from '../components/MyProfile';
import ManagePhotos from '../components/ManagePhotos';
import EditProfile from '../components/EditProfile';
import TrustScore from '../components/TrustScore';
import VerifyEmail from '../components/VerifyEmail';
import VerifyPhone from '../components/VerifyPhone';
import DeclinedProfile from '../components/DeclinedProfile';
import EditPreference from '../components/EditPreference';

// MSGR
import Msgr, {ChatRqsts, Chats} from '../components/msgr';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

class RootNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginCheck: false,
      isLoggedIn: false,
      user: {},
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    let user = auth().currentUser;
    if (user) {
      // console.log(user);
      this.setState({user});
      this.userRef = database().ref('Users/' + user.uid);
    }
    this.checkAuthentication();
  }

  componentWillUnmount() {
    this._isMounted = false;
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
          // this.props.navigation.navigate('Login');
          this.setState({loginCheck: true, isLoggedIn: false});
          return;
        }

        if (isRegistered.exists) {
          this._setLoginUser(isRegistered.user)
            .then(() => {
              this.setState({isLoggedIn: true, loginCheck: true});
            })
            .catch((err) => {
              this.setState({isLoggedIn: false, loginCheck: true});
            });
        }
      } catch (error) {
        console.log(error);
        this.setState({loginCheck: true, isLoggedIn: false});
        // this.props.navigation.navigate('Login');
      }
    } else {
      this.setState({loginCheck: true, isLoggedIn: false});
      // this.props.navigation.navigate('Login');
    }
  };

  _setLoginUser = (userDat) => {
    let user = {...this.state.user, ...userDat};

    return new Promise((resolve, reject) => {
      this.setState({user}, () => {
        CheckUser.isRegistered(userDat.uid)
          .then((res) => {
            if (res.exists) {
              let userDat = {...this.state.user, ...res.user};
              this.setState({user: userDat});
              this._callListeners(userDat);
            }
            CheckUser.isDeleted(userDat.uid)
              .then((isDeleted) => {
                resolve({
                  isRegistered: res.exists,
                  isDeleted,
                  data: {...this.state},
                });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  };

  _loginCheck = () => {
    this._isMounted && this.setState({loginCheck: true});
  };

  _logout = () => {
    this._isMounted && this.setState({isLoggedIn: false, user: {}});
    this._removeListeners();
  };

  _callListeners = (user) => {
    this._callUserListener(user);
  };

  _removeListeners = () => {
    this.userRef.off('value');
  };

  _callUserListener = (user) => {
    this.userRef.on('value', (snapshot) => {
      let userDat = snapshot.val();
      this.setState({user: userDat});
      // console.log(userDat);
    });
  };

  changeDP = async (key, url) => {
    try {
      let dp = await database()
        .ref('Users/' + this.state.user_data.uid)
        .child(key)
        .set(url);
      return true;
    } catch (err) {
      return false;
    }
  };

  _saveToFirebase = async (data) => {
    const uid = auth().currentUser.uid;
    let keys = Object.keys(data);

    console.log(keys);

    for (let index = 0; index < keys.length; index++) {
      let key = keys[index];
      let value = data[key];

      try {
        if (key == 'rl') {
          let d = await this.userRef.child('rle').set(1);
        }
        if (key == 'ae') {
          let ob = {};
          ob['id'] = uid;
          ob['text'] = value;
          let d = await database()
            .ref('aboutApprovals/' + uid)
            .set(ob);
        }
        let c = await this.userRef.child(key).set(value);
      } catch (error) {
        console.log('saveToFirebase error: ', error);
        return false;
      }
    }

    return true;
  };

  _savePPToFirebase = async (data) => {
    let keys = Object.keys(data);

    for (let index = 0; index < keys.length; index++) {
      let key = keys[index];
      let value = data[key];

      try {
        let c = await this.userRef.child('pp').child(key).set(value);
      } catch (error) {
        return false;
      }
    }

    return true;
  };

  updateTSBy20 = async () => {
    console.log('updatin ts by 20 check');

    let ts = this.state.user_data.ts.ts;
    ts += 20;
    try {
      let up = await this.userRef.child('ts').child('ts').set(ts);
      return true;
    } catch (err) {
      return false;
    }
  };

  _verifyEmail = async (email) => {
    try {
      let up = await this.userRef.child('ts').child('em').set(1);
      let em = await this.userRef.child('em').set(email);
      return true;
    } catch (err) {
      return false;
    }
  };

  _verifyPhone = async (phone) => {
    try {
      let up = await this.userRef.child('ts').child('m').set(1);

      let addMobileNumber = await this.userRef.child('cn').set(phone);
      return true;
    } catch (err) {
      return false;
    }
  };

  _verifyFB = async () => {
    try {
      let up = await this.userRef.child('ts').child('f').set(1);
      return true;
    } catch (err) {
      return false;
    }
  };

  _loginRegisterStack = (context) => (
    <>
      <Stack.Screen name="Login">
        {(props) => <Login context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="PhoneLogin">
        {(props) => <PhoneLogin context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Registration">
        {(props) => <RegisterationScreen context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  _settingsStack = (context) => (
    <>
      {/* <Stack.Screen name="FAQ" component={FAQ} /> */}
      <Stack.Screen name="Blocked">
        {(props) => <BlockedUser context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Delete">
        {(props) => <DeleteProfile context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="PrivacyPolicy">
        {(props) => <PrivacyPolicy context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="TermsofUse">
        {(props) => <TermsOfUse context={context} refr {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Safety Guidelines">
        {(props) => <SafetyGuidelines context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Help">
        {(props) => <Help context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Frequently Asked Question">
        {(props) => <FAQs context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Change Mobile Number">
        {(props) => <ChangeMobileNumber context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  _profileStack = (context) => (
    <>
      <Stack.Screen name="My Profile">
        {(props) => <MyProfile context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Manage Photos">
        {(props) => <ManagePhotos context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Edit Profile">
        {(props) => <EditProfile context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Trust Score">
        {(props) => <TrustScore context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Email Address">
        {(props) => <VerifyEmail context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Phone Number">
        {(props) => <VerifyPhone context={context} {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Edit Preference">
        {(props) => <EditPreference context={context} {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Declined Profile">
        {(props) => <DeclinedProfile context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  _msgrStack = (context) => (
    <>
      <Stack.Screen name="MessageBoard">
        {(props) => <Chats context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Chat Request">
        {(props) => <ChatScreen context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Message">
        {(props) => <Msgr context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  render() {
    let {loginCheck, isLoggedIn, user} = this.state;
    let context = {
      user,
      _setLoginUser: this._setLoginUser,
      verifyEmail: this._verifyEmail,
      verifyPhone: this._verifyPhone,
      verifyFB: this._verifyFB,
      saveToFirebase: this._saveToFirebase,
      savePPToFirebase: this._savePPToFirebase,
    };
    return (
      <Stack.Navigator
        headerMode={'none'}
        screenOptions={{
          gestureEnabled: true,
          animationEnabled: true,
          gestureDirection: 'horizontal',

          ...TransitionPresets.SlideFromRightIOS,
          cardStyle: {
            // backgroundColor: appTheme.bg,
          },
        }}>
        {!loginCheck ? (
          <Stack.Screen name="Splash">
            {(props) => (
              <Splash
                context={context}
                _loginCheck={this._loginCheck}
                {...props}
              />
            )}
          </Stack.Screen>
        ) : null}
        {!isLoggedIn ? this._loginRegisterStack(context) : null}
        <Stack.Screen name="Drawer">
          {(props) => <DrawerScreeen context={context} {...props} />}
        </Stack.Screen>
        {/* <Stack.Screen name="Member Profile">
          {(props) => <DrawerScreeen context={context} {...props} />}
        </Stack.Screen> */}
        <Stack.Screen name="Search">
          {(props) => <Search context={context} {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Search Result">
          {(props) => <SearchResult context={context} {...props} />}
        </Stack.Screen>

        {this._profileStack(context)}
        {this._settingsStack(context)}
        {this._msgrStack(context)}
      </Stack.Navigator>
    );
  }
}

function DrawerScreeen(rootProps) {
  return (
    <>
      <Drawer.Navigator
        drawerContent={(props) => (
          <SideBar root={rootProps} context={rootProps.context} {...props} />
        )}>
        <Drawer.Screen name={'Dashboard'}>
          {(props) => (
            <Dashboard
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name={'My Matches'}>
          {(props) => (
            <MyMatches
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name={'Likes'}>
          {(props) => (
            <LikesScreen
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Drawer.Screen>

        <Drawer.Screen name={'Likes Sent'}>
          {(props) => (
            <LikesSentScreen
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen name={'Settings'}>
          {(props) => (
            <Settings root={rootProps} context={rootProps.context} {...props} />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </>
  );
}

function HomeScreen(props) {
  return <Text></Text>;
}

function RegisterationScreen(props) {
  return (
    <RegistrationHOC {...props}>
      <RegistrationContext.Consumer>
        {(reg) => <Registration {...props} reg={reg} />}
      </RegistrationContext.Consumer>
    </RegistrationHOC>
  );
}

function Header(props) {
  return (
    <Appbar.Header>
      <Appbar.BackAction
        onPress={() => {
          if (props.navigation.canGoBack()) {
            props.navigation.goBack();
          }
        }}
      />
      <Appbar.Content title={props.title}></Appbar.Content>
    </Appbar.Header>
  );
}

export default RootNav;
