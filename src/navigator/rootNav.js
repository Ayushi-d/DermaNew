import React from 'react';
import {Text, AppState, Platform} from 'react-native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Registration from '../screens/Register/register';
// import Login from '../screens/Register/login';
import Login from '../components/login';
import PhoneLogin from '../components/PhoneLogin';
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
import messaging from '@react-native-firebase/messaging';

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
import About from '../components/Setting/About';
import BetterMatches from '../components/Setting/BetterMatches';
import MultiChoicePickerDisplayScreen from "../screens/MultiplePickerDisplayScreen";

// MemberShip
import MemberShip from '../components/Membership';

// Profile
import MyProfile from '../components/MyProfile';
import ManagePhotos from '../components/ManagePhotos';
import EditProfile from '../components/EditProfile';
import TrustScore from '../components/TrustScore';
import VerifyEmail from '../components/VerifyEmail';
import VerifyPhone from '../components/VerifyPhone';
import DeclinedProfile from '../components/DeclinedProfile';
import EditPreference from '../components/EditPreference';
import MemberProfile from '../components/MemberProfile';

// MSGR
import Msgr, {ChatRqsts, Chats} from '../components/msgr';

import PushNotification from 'react-native-push-notification';
import UpdateModal from './updateModal';

const DUMMY_DP =
  'https://firebasestorage.googleapis.com/v0/b/derma-cupid.appspot.com/o/images%2FNew%20User%2FProfile-ICon.png?alt=media&token=3a84752a-9c6e-4dcd-b31a-aec8675d55c1';

const Stack = createStackNavigator();

const Drawer = createDrawerNavigator();

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().onMessage(async (remoteMessage) => {
  console.log('Message handled in the foreground!', remoteMessage);
});

class RootNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginCheck: false,
      isLoggedIn: false,
      user: {},
      updatedversion: true,
      url: '',
    };
    this._isMounted = false;
    this._msgListeners = [];
    this.appState = AppState.currentState;
    this.appversion = '1.5.3';
  }

  componentDidMount() {
    this._isMounted = true;
    PushNotification.cancelAllLocalNotifications();
    AppState.addEventListener('change', this._handleAppStateChange);
    // this._checkUpdate();
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
    this._removeListeners();
  }

  _checkUpdate = async () => {
    try {
      let snap = await database().ref('appStatus').once('value');
      let version = snap.val();
      if (Platform.OS === 'android') {
        if (this.appversion !== version?.androidversion) {
          console.log('appversion: ', this.appversion, version?.androidversion);
          this.setState({updatedversion: false, url: version?.androidUrl});
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  _handleAppStateChange = (nextAppState) => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      PushNotification.cancelAllLocalNotifications();
    }
    this.appState = nextAppState;
  };

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
              this.setState({
                user: isRegistered.user,
                isLoggedIn: true,
                loginCheck: true,
              });
            })
            .catch((err) => {
              this.setState({isLoggedIn: false, loginCheck: true});
            });
        } else {
          this.setState({loginCheck: true, isLoggedIn: false});
          return;
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

    this._getSetToken(userDat);

    return new Promise((resolve, reject) => {
      this.setState({user}, () => {
        CheckUser.isRegistered(userDat.uid)
          .then((res) => {
            if (res.exists) {
              let userDat = {...this.state.user, ...res.user};
              this._checkPrem(userDat);
              this._checkFB(userDat);
              this.setState({user: userDat, isLoggedIn: true});
              this._callListeners(userDat);
            } else {
              this.setState({
                user: userDat,
                isLoggedIn: false,
                loginCheck: true,
              });
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

  _checkFB = (user) => {
    let usrDat = auth().currentUser;
    usrDat.providerData.forEach((p) => {
      if (p.providerId === 'facebook.com') {
        if (!user.FBurl) {
          console.log('no FB url yet!');
          console.log('no userr!', user);
          // database()
          //   .ref(`Users/${user.uid}`)
          //   .child('FBurl')
          //   .set(`https://www.facebook.com/${p.uid}`)
          //   .catch((err) => console.log('error updating fb profile!: ', err));
          database()
              .ref(`Users/${user.uid}`)
              .child('FBname')
              .set(p?.displayName)
              .catch((err) => console.log('error updating fb profile!: ', err));
        }
      }
    });
  };

  _checkPrem = (user) => {
    let prem = user.prem;
    if (!prem) {
      return;
    }
    if (prem.up) {
      let tp = prem.tp;
      let dtp = new Date(tp);
      let dt = new Date(dtp.setMonth(dtp.getMonth() + 1));

      let cDt = new Date();

      if (dt.getTime() <= cDt.getTime()) {
        console.log('membership over!');
        database()
          .ref(`Users/${user.uid}`)
          .child('prem')
          .child('up')
          .set(false)
          .catch((err) => console.log('rootNav.js err _checkPrem: ', err));
      }
    }
  };

  _getSetToken = (user) => {
    // if (!user.token) {
    messaging()
      .getToken()
      .then((token) => {
        // console.log(token);
        if (user.token === token) {
          return;
        }
        database()
          .ref(`Users/${user.uid}/token`)
          .set(token)
          .catch((Err) =>
            console.log('unable to setToken when not found: ', Err),
          );
      });
    // }

    messaging().onTokenRefresh((token) => {
      database()
        .ref(`Users/${user.uid}/token`)
        .set(token)
        .catch((Err) => console.log('unable to setToken onRefresh: ', Err));
    });
  };

  setData = ({providerId, email, displayName, uid, phone}) => {
    this._isMounted &&
      this.setState({user: {providerId, email, displayName, uid, phone}});
    return new Promise((resolve, reject) => {
      this.setState({providerId, email, uid, displayName, phone}, () => {
        CheckUser.isRegistered(uid)
          .then((res) => {
            CheckUser.isDeleted(uid)
              .then((isDeleted) => {
                resolve({isRegistered: res, isDeleted, data: {...this.state}});
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

  _completeLogin = (loginCheck, isLoggedIn) => {
    this.setState({loginCheck, isLoggedIn});
  };

  _loginCheck = () => {
    this._isMounted && this.setState({loginCheck: true});
  };

  _logout = () => {
    console.log('logout!');
    this._isMounted && this.setState({isLoggedIn: false, user: {}});
    this._removeListeners();
  };

  _callListeners = () => {
    let user = auth().currentUser;
    this.userRef = database().ref('Users/' + user.uid);
    this._callUserListener(user);
  };

  _removeListeners = () => {
    if (this.userRef) {
      this.userRef.off('value');
      this.userRef.off('child_changed');
      this.userRef.off('child_added');
      this.userRef.off('child_removed');
    }
    if (this.tsRef) this.tsRef.off('value');
  };

  _callUserListener = (user) => {
    this.userRef.on('value', (snapshot) => {
      let userDat = snapshot.val();
      if (snapshot.val() === null) {
        this._removeListeners();
        this._logout();
        return;
      }
      this.setState({user: userDat});
      this.trustScoreEventListener();
      this.privacyNameListener(userDat, userDat.uid);
      this.profilePicEventListener(userDat);
    });
  };

  trustScoreEventListener = () => {
    const {uid} = auth().currentUser;

    this.tsRef = database().ref(`Users/${uid}/ts`);

    this.tsRef.on('value', (snap) => {
      let value = snap.val();
      let count = 0;

      Object.keys(value).map((item) => {
        if (item == 'ts') {
          return;
        }

        if (value[item] == 1) {
          count++;
        }
      });

      // console.log(count);

      if (count * 20 != value['ts']) {
        database()
          .ref(`Users/${uid}/ts`)
          .child('ts')
          .set(count * 20);
      }
    });
  };

  removeTrustScoreEventListener = () => {
    if (this.tsRef) this.tsRef.off('value');
  };

  getShowName = (pnm, name, gender) => {
    if (pnm == 1) {
      return gender == 'Male' ? name.split(' ')[0] : name.charAt(0);
    } else {
      return name.charAt(0);
    }
  };

  privacyNameListener = (data, uid) => {
    let gender = data.g;
    let show_name = data.sn;
    let name = data.nm;
    let pnm = data.pnm;

    let correct_show_name = this.getShowName(pnm, name, gender);

    if (show_name == correct_show_name) {
      return;
    }

    database()
      .ref('Users/' + uid)
      .child('sn')
      .set(correct_show_name);
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

    // console.log(keys);

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

    let ts = this.state.user.ts.ts;
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

  profilePicEventListener = (user_data) => {
    const APPROVED = user_data.dp != DUMMY_DP ? true : false;

    // if none

    let aop = user_data.aop && Object.values(user_data.aop);
    let op = user_data.op && Object.values(user_data.op);
    let dp = user_data.dp;
    let ndp = user_data.ndp;

    if (!user_data.aop && !user_data.op) {
      if (user_data.dp != DUMMY_DP) {
        this.changeDP('dp', DUMMY_DP);
      }

      if (user_data.ndp != DUMMY_DP) {
        this.changeDP('ndp', DUMMY_DP);
      }

      this.csOfAddPhoto(0);

      return;
    }

    if (!APPROVED && user_data.aop && !aop.includes(ndp)) {
      this.changeDP('ndp', aop[0]);
      if (user_data.ts.dp != -1) {
        this.csOfAddPhoto(-1);
      }
    }
    if (!APPROVED && user_data.aop && !aop.includes(dp)) {
      console.log('call!');

      this.changeDP('ndp', aop[0]);
      if (user_data.ts.dp != -1) {
        this.csOfAddPhoto(-1);
      }
    }

    if (APPROVED && user_data.op && ndp != dp) {
      this.changeDP('ndp', dp);
    }

    if (APPROVED && user_data.op && !op.includes(dp)) {
      this.changeDP('dp', op[0]);
      this.changeDP('ndp', op[0]);
    }

    if (APPROVED && !user_data.op) {
      this.changeDP('dp', DUMMY_DP);

      if (user_data.aop) {
        this.changeDP('ndp', aop[0]);
        this.csOfAddPhoto(-1);
      } else {
        this.changeDP('ndp', DUMMY_DP);
        this.csOfAddPhoto(0);
      }
    }

    if (!APPROVED && user_data.op) {
      this.changeDP('dp', op[0]);
      this.changeDP('ndp', op[0]);
    }

    if (APPROVED && user_data.op && user_data.ts.dp != 1) {
      this.csOfAddPhoto(1);
    }
  };

  csOfAddPhoto = async (value) => {
    try {
      let ap = await this.userRef.child('ts').child('dp').set(value);
      return true;
    } catch (error) {
      return true;
    }
  };

  _loginRegisterStack = (context) => (
    <>
      <Stack.Screen name="Login" options={{gestureEnabled: false}}>
        {(props) => <Login context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="PhoneLogin" options={{gestureEnabled: false}}>
        {(props) => <PhoneLogin context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Registration" options={{gestureEnabled: false}}>
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
      <Stack.Screen name="PrivacyPolicy">
        {(props) => <PrivacyPolicy context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="TermsofUse">
        {(props) => <TermsOfUse context={context} refr {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Safety Guidelines">
        {(props) => <SafetyGuidelines context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Help Screen">
        {(props) => <Help context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Frequently Asked Question">
        {(props) => <FAQs context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="About">
        {(props) => <About context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="BetterMatches">
        {(props) => <BetterMatches context={context} {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Change Mobile Number">
        {(props) => <ChangeMobileNumber context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  _profileStack = (context) => (
    <>
      {/* <Stack.Screen name="My Profile">
        {(props) => <MyProfile context={context} {...props} />}
      </Stack.Screen> */}
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

      {/* <Stack.Screen name="Declined Profile">
        {(props) => <DeclinedProfile context={context} {...props} />}
      </Stack.Screen> */}

      <Stack.Screen name="Member Profile">
        {(props) => <MemberProfile context={context} {...props} />}
      </Stack.Screen>

      <Stack.Screen name="Delete">
        {(props) => <DeleteProfile context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  _msgrStack = (context) => (
    <>
      {/* <Stack.Screen name="MessageBoard">
        {(props) => <Chats context={context} {...props} />}
      </Stack.Screen> */}
      {/* <Stack.Screen name="Chat Request">
        {(props) => <ChatRqsts context={context} {...props} />}
      </Stack.Screen> */}
      <Stack.Screen name="Message">
        {(props) => <Msgr context={context} {...props} />}
      </Stack.Screen>
    </>
  );

  render() {
    let {loginCheck, isLoggedIn, user, updatedversion, url} = this.state;
    if (!updatedversion) {
      return <UpdateModal visible={!updatedversion} url={url} />;
    }
    let context = {
      user,
      _setLoginUser: this._setLoginUser,
      _checkAuth: this.checkAuthentication,
      verifyEmail: this._verifyEmail,
      verifyPhone: this._verifyPhone,
      verifyFB: this._verifyFB,
      saveToFirebase: this._saveToFirebase,
      savePPToFirebase: this._savePPToFirebase,
      setData: this.setData,
      updateTSBy20: this.updateTSBy20,
      _logout: this._logout,
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
        {/* <Stack.Screen name={'Test'}>
          {(props) => <TestScreen context={context} {...props} />}
        </Stack.Screen> */}
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
        {!isLoggedIn ? (
          this._loginRegisterStack(context)
        ) : (
          <>
            <Stack.Screen name="Drawer">
              {(props) => <DrawerScreeen context={context} {...props} />}
            </Stack.Screen>
            {/* <Stack.Screen name="Member Profile">
          {(props) => <DrawerScreeen context={context} {...props} />}
        </Stack.Screen> */}
            {/* <Stack.Screen name="Search">
              {(props) => <Search context={context} {...props} />}
            </Stack.Screen> */}

            <Stack.Screen name="Search Result">
              {(props) => <SearchResult context={context} {...props} />}
            </Stack.Screen>

            {this._profileStack(context)}
            {this._msgrStack(context)}
            <Stack.Screen name="Membership">
              {(props) => <MemberShip context={context} {...props} />}
            </Stack.Screen>
          </>
        )}

        {this._settingsStack(context)}
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

        <Stack.Screen name="Search">
          {(props) => (
            <Search root={rootProps} context={rootProps.context} {...props} />
          )}
        </Stack.Screen>
        <Stack.Screen name="SearchMultiple">
          {(props) => (
              <MultiChoicePickerDisplayScreen root={rootProps} context={rootProps.context} {...props} />
          )}
        </Stack.Screen>
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

        <Stack.Screen name="My Profile">
          {(props) => (
            <MyProfile
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="MessageBoard">
          {(props) => (
            <Chats root={rootProps} context={rootProps.context} {...props} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Chat Request">
          {(props) => (
            <ChatRqsts
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Declined Profile">
          {(props) => (
            <DeclinedProfile
              root={rootProps}
              context={rootProps.context}
              {...props}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="FAQs">
          {(props) => (
            <FAQs root={rootProps} context={rootProps.context} {...props} />
          )}
        </Stack.Screen>

        {/*<Stack.Screen name="Help">*/}
        {/*  {(props) => (*/}
        {/*    <Help*/}
        {/*      root={rootProps}*/}
        {/*      context={rootProps.context}*/}
        {/*      type*/}
        {/*      {...props}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*</Stack.Screen>*/}
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
