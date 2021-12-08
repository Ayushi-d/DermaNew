import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  StatusBar,
} from 'react-native';
import DermaBg from '../general/background';
import THEME from '../../config/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import {Menu, Divider} from 'react-native-paper';

import BlockModal from '../modals/block';
import ReportModal from '../modals/report';

import LinearGradient from 'react-native-linear-gradient';

let GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

export default class MsgHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      blockOpen: false,
      reportOpen: false,
    };
    this._isMounted = false;
  }

  _goBack = () => {
    let {navigation, type} = this.props;
    if (type) {
      navigation.openDrawer();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.pop();
    }
  };

  _goToDashboard = () => {
    let {navigation} = this.props;
    if (navigation.canGoBack()) {
      navigation.navigate('Dashboard');
    }
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _openMenu = () => {
    this.setState({menuOpen: true});
  };

  _closeMenu = () => {
    this.setState({menuOpen: false});
  };

  _toggleBlockModal = () => {
    this.setState({blockOpen: !this.state.blockOpen});
  };

  _toggleReportModal = () => {
    this.setState({reportOpen: !this.state.reportOpen});
  };

  _navToProfile = () => {
    let {refr, navigation, route} = this.props;
    if (!refr) {
      let data = route.params.data.otheruser;
      navigation.push('Member Profile', {
        data,
        fromPage: this.props.fromPage,
        fromPageHistory: this.props.fromPage,
        hideMessage: true,
      });
    }
  };

  render() {
    let {menuOpen, blockOpen, reportOpen} = this.state;
    let {refr, type, title, right, route, context, hideRight} = this.props;
    let {user} = context;
    let oUser = {};
    if (refr) {
      oUser = route.params.data;
    } else {
      oUser = route.params.data.otheruser;
    }

    return (
      <View style={{...styles.header}}>
        <LinearGradient
          colors={GRCOLOR}
          style={styles.headerMain}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Pressable style={styles.iconBtn} onPress={this._goBack}>
              {type ? (
                <MaterialIcons
                  name={'menu-open'}
                  color={THEME.WHITE}
                  size={28}
                />
              ) : (
                <Ionicons name={'arrow-back'} color={THEME.WHITE} size={28} />
              )}
            </Pressable>

            {title ? (
              <View style={styles.middleHead}>
                <Text style={styles.title}>{title ? title : ''}</Text>
              </View>
            ) : (
              <Pressable style={styles.middleHead} onPress={this._navToProfile}>
                {oUser && oUser.dp ? (
                  <Image source={{uri: oUser.dp}} style={styles.propic} />
                ) : null}

                <View style={styles.headerTxt}>
                  <Text style={styles.title}>
                    {oUser ? (oUser.sn ? oUser.sn : '') : ''}
                  </Text>
                  {/* <Text style={styles.status}>Online</Text> */}
                </View>
              </Pressable>
            )}
            {!hideRight ? (
              <>
                {right ? (
                  <Menu
                    visible={menuOpen}
                    onDismiss={this._closeMenu}
                    anchor={
                      <Pressable
                        style={{
                          ...styles.iconBtn,
                          height: 50,
                        }}
                        onPress={this._openMenu}>
                        <Entypo name={'block'} color={THEME.WHITE} size={24} />
                      </Pressable>
                    }>
                    <Menu.Item
                      onPress={() => {
                        this._toggleBlockModal();
                        this._closeMenu();
                      }}
                      title="BLOCK"
                    />
                    <Menu.Item
                      onPress={() => {
                        this._toggleReportModal();
                        this._closeMenu();
                      }}
                      title="REPORT"
                    />
                  </Menu>
                ) : (
                  <Pressable
                    style={styles.iconBtn}
                    onPress={this._goToDashboard}>
                    <AntDesign name={'home'} color={THEME.WHITE} size={28} />
                  </Pressable>
                )}
              </>
            ) : null}
          </View>
        </LinearGradient>
        {/* <StatusBar barStyle={'light-content'} /> */}
        <BlockModal
          isVisible={blockOpen}
          userToBlock={oUser?.uid}
          blockToggle={this._toggleBlockModal}
          {...this.props}
        />
        <ReportModal
          isVisible={reportOpen}
          userToReport={oUser.uid}
          reportToggle={this._toggleReportModal}
          {...this.props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 50,
  },
  headerMain: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    alignSelf: 'center',
    backgroundColor: THEME.WHITE,
  },
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  middleHead: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  propic: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  headerTxt: {
    marginLeft: 7,
    justifyContent: 'center',
  },
  title: {
    color: THEME.WHITE,
    // fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    fontSize: 10,
    color: '#fff',
  },
});
