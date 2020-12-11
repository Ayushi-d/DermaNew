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
      navigation.goBack();
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
    let {refr, type, right, route} = this.props;
    let oUser = {};
    if (refr) {
      oUser = route.params.data;
    } else {
      oUser = route.params.data.otheruser;
    }
    // console.log(this.props.data);
    // if (refr) {
    //   return <></>;
    // }

    return (
      <View style={{...styles.header}}>
        <DermaBg>
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
                    this._toggleReportModal();
                    this._closeMenu();
                  }}
                  title="REPORT"
                />
                <Menu.Item
                  onPress={() => {
                    this._toggleBlockModal();
                    this._closeMenu();
                  }}
                  title="BLOCK"
                />
              </Menu>
            ) : (
              <Pressable style={styles.iconBtn} onPress={this._goToDashboard}>
                <AntDesign name={'home'} color={THEME.WHITE} size={28} />
              </Pressable>
            )}
          </View>
        </DermaBg>
        <StatusBar barStyle={'light-content'} />
        <BlockModal
          isVisible={blockOpen}
          userToBlock={oUser.uid}
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
