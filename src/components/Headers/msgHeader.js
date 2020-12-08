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

export default class DrawerStackHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    let {title, type, route} = this.props;
    let oUser = route.params.data.data.otheruser;

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

            <View style={styles.middleHead}>
              {oUser && oUser.dp ? (
                <Image source={{uri: oUser.dp}} style={styles.propic} />
              ) : null}

              <View style={styles.headerTxt}>
                <Text style={styles.title}>
                  {oUser ? (oUser.nm ? oUser.nm : '') : ''}
                </Text>
                <Text style={styles.status}>Online</Text>
              </View>
            </View>

            <Pressable style={styles.iconBtn} onPress={this._goToDashboard}>
              <AntDesign name={'home'} color={THEME.WHITE} size={28} />
            </Pressable>
          </View>
        </DermaBg>
        <StatusBar barStyle={'light-content'} />
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
    width: 34,
    height: 34,
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
