import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import style from '../ChangeMobileNumber/style';
import Header from '../Headers/SettingsHeader';
import THEME from '../../config/theme';
import Mci from 'react-native-vector-icons/MaterialCommunityIcons';
import Ant from 'react-native-vector-icons/AntDesign';
import Oct from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import Loader from '../modals/loaders';

import database from '@react-native-firebase/database';
import moment from 'moment';

import WebView from 'react-native-webview';

import logo from '../../assets/logo.png';

const html = `
      <html>
      <head></head>
      <body>
        <script>
          setTimeout(function () {
            window.ReactNativeWebView.postMessage("Hello!")
          }, 2000)
        </script>
      </body>
      </html>
    `;

export default class MemberShip extends React.Component {
  constructor(props) {
    super(props);
    let {user} = this.props.context;

    this.state = {
      prem: user.prem && user.prem.up,
      loading: false,
      showPayout: false,
      pageProg: false,
      progClr: '#000',
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  //   componentDidUpdate(prevProps) {
  //     let prevUser = prevProps.context.user;
  //     let {user} = this.props.context;

  //     if (prevUser.prem && user.prem && prevUser.prem.up !== user.prem.up) {
  //       this.setState({prem: user.prem});
  //       if (user.prem.up) {
  //         // alert('You are a Premium member now!');
  //       }
  //     }
  //   }

  _upgrade = () => {
    this.setState({showPayout: true});
  };

  _payoutResponse = (r) => {
    this.setState({showPayout: false});
  };

  render() {
    let {prem, showPayout, pageProg, progClr} = this.state;
    let {user} = this.props.context;
    if (prem) {
      let dt = new Date(user.prem.tp);
      let newDt = new Date(dt.setMonth(dt.getMonth() + 1));
      return (
        <View style={styles.container}>
          <Header title={'MEMBERSHIP'} {...this.props} />
          <View style={styles.membershipCon}>
            <Text style={styles.memberShipTxt}>You are a Premium member.</Text>
            <Text style={{...styles.memberShipTxt, marginTop: 30}}>
              Membership valid till{' '}
              <Text style={{color: '#0066cc'}}>{moment(newDt).calendar()}</Text>
            </Text>
          </View>
          {/* <WebView
            source={{
              uri:
                'http://13.233.150.95/atom/core/Core%20PHP%20OTS%20AES/test.php',
            }}
            onMessage={(event) => {
              alert(event.nativeEvent.data);
            }}
          /> */}
        </View>
      );
    }
    let price = '₹399';
    let payout = `https://admin.dermacupid.com/gateway/payout.php?uid=${user.uid}`;
    if (user.c !== 'India') {
      price = 'USD 5.99';
      payout = `https://derma-cupid-94d0a.web.app/${user.uid}`;
    }
    return (
      <View style={styles.container}>
        <Header title={'MEMBERSHIP'} {...this.props} />
        <View style={styles.membershipCon}>
          <Text style={styles.memberShipTxt}>
            Become a premium member to chat, send messages and connect with
            interesting profiles instantly!
          </Text>
          <View style={styles.upgradeCon}>
            <Text style={styles.upgradeTxt}>{price} for 1 month</Text>
            <TouchableOpacity style={styles.upgradeBtn} onPress={this._upgrade}>
              <Text style={styles.upgradeBtnTxt}>UPGRADE</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.benefitCon}>
            <Text style={styles.benefitConTxt}>
              PREMIUM MEMBERSHIP BENEFITS
            </Text>
            <View style={styles.benefits}>
              <View style={styles.benefit}>
                <Icon>
                  <Mci name={'message-processing'} color={'#fff'} size={21} />
                </Icon>
                <Text style={styles.benefitTxt}>
                  Send unlimited chat messages
                </Text>
              </View>
              <View style={styles.benefit}>
                <Icon>
                  <Mci name={'heart'} color={'#fff'} size={21} />
                </Icon>
                <Text style={styles.benefitTxt}>Send unlimited Likes</Text>
              </View>
              <View style={styles.benefit}>
                <Icon>
                  <Ant name={'search1'} color={'#fff'} size={21} />
                </Icon>
                <Text style={styles.benefitTxt}>
                  Appear on top of search results
                </Text>
              </View>
              <View style={styles.benefit}>
                <Icon style={{backgroundColor: '#0066cc'}}>
                  <Oct name={'zap'} color={'#fff'} size={21} />
                </Icon>
                <Text style={styles.benefitTxt}>
                  10x higher chance of match
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Loader isVisible={this.state.loading} />
        <Modal
          visible={showPayout}
          onDismiss={() => this.setState({showPayout: false})}
          transparent
          animationType={'fade'}>
          <View style={{flex: 1, backgroundColor: 'rgba(255,255,255,0.5)'}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                elevation: 2,
              }}>
              <TouchableOpacity
                style={{padding: 14}}
                onPress={() => this.setState({showPayout: false})}>
                <Feather name={'x'} size={23} color={'#000'} />
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={logo}
                  style={{
                    width: 30,
                    height: 30,
                  }}
                />
              </View>
              <View
                style={{
                  padding: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Feather
                  name={'x'}
                  size={23}
                  color={'#fff'}
                  style={{opacity: 1}}
                />
                {pageProg ? (
                  <ActivityIndicator
                    style={{
                      position: 'absolute',
                    }}
                    color={progClr}
                    size={27}
                  />
                ) : null}
              </View>
            </View>
            {showPayout ? (
              <WebView
                source={{
                  uri: payout,
                }}
                onMessage={(event) => {
                  let data = event.nativeEvent.data;
                  let prem = data === 'true';
                  if (prem) {
                    alert('Congratulations! You are a Premium Member now!');
                  } else {
                    alert('Something went wrong, Please try again!');
                  }
                  this.setState({prem, showPayout: false});
                }}
                onLoadStart={() =>
                  this.setState({pageProg: true, progClr: '#000'})
                }
                onLoadProgress={() =>
                  this.setState({
                    pageProg: true,
                    progClr: THEME.GRADIENT_BG.END_COLOR,
                  })
                }
                onLoadEnd={() => {
                  this.setState({pageProg: false});
                }}
                onLoad={() => {
                  this.setState({pageProg: false});
                }}
              />
            ) : null}
          </View>
        </Modal>
      </View>
    );
  }
}

function Icon(props) {
  return (
    <View style={styles.iconCon}>
      <View style={{...styles.icon, ...props.style}}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  membershipCon: {
    flex: 1,
    backgroundColor: '#ffffff',
    elevation: 3,
    padding: 10,
    margin: 10,
  },
  memberShipTxt: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  upgradeCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeTxt: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 27,
  },
  upgradeBtn: {
    marginTop: 20,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: THEME.GRADIENT_BG.END_COLOR,
    alignItems: 'center',
    paddingVertical: 10,
  },
  upgradeBtnTxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  benefitCon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitConTxt: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 18,
  },
  benefits: {
    paddingVertical: 20,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitTxt: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  iconCon: {
    padding: 5,
  },
  icon: {
    backgroundColor: THEME.GRADIENT_BG.END_COLOR,
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
