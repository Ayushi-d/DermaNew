import React from 'react';
import {View, Text, StyleSheet, Pressable, StatusBar} from 'react-native';
import DermaBg from '../general/background';
import THEME from '../../config/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

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
    let {title, type} = this.props;
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
              <Text style={styles.title}>{title ? title : ''}</Text>
            </View>

            <Pressable style={styles.iconBtn} onPress={this._goToDashboard}>
              <Entypo name={'home'} color={THEME.WHITE} size={28} />
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
    justifyContent: 'center',
  },
  title: {
    color: THEME.WHITE,
    // fontWeight: 'bold',
    fontSize: 16,
  },
});
