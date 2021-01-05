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
import menu from '../../assets/general/ic_menu.png';

import LinearGradient from 'react-native-linear-gradient';

let GRCOLOR = [...THEME.GRADIENT_BG.PAIR].reverse();

export default class DrawerStackHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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

  render() {
    let {title, type, hideRight} = this.props;
    return (
      <View style={{...styles.header}}>
        {/* <DermaBg> */}
        <LinearGradient
          colors={GRCOLOR}
          style={styles.headerMain}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Pressable style={styles.iconBtn} onPress={this._goBack}>
              {type ? (
                <Image source={menu} style={styles.image} />
              ) : (
                <Ionicons name={'arrow-back'} color={THEME.WHITE} size={28} />
              )}
            </Pressable>

            <View style={styles.middleHead}>
              <Text style={styles.title}>{title ? title : ''}</Text>
            </View>
            {!hideRight ? (
              <Pressable style={styles.iconBtn} onPress={this._goToDashboard}>
                <Entypo name={'home'} color={THEME.WHITE} size={28} />
              </Pressable>
            ) : null}
          </View>
        </LinearGradient>

        {/* </DermaBg> */}
        {/* <StatusBar barStyle={'light-content'} /> */}
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

  image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  middleHead: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: THEME.WHITE,
    // fontWeight: 'bold',
    fontSize: 16,
  },
});
