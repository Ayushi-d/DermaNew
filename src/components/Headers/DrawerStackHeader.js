import React from 'react';
import {View, Text, StyleSheet, Pressable, StatusBar} from 'react-native';
import DermaBg from '../general/background';
import THEME from '../../config/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class DrawerStackHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let {title, navigation} = this.props;
    return (
      <View style={{...styles.header}}>
        <DermaBg>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Pressable style={styles.iconBtn} onPress={navigation.openDrawer}>
              <MaterialIcons name={'menu-open'} color={THEME.WHITE} size={28} />
            </Pressable>

            <View style={styles.middleHead}>
              <Text style={styles.title}>{title ? title : ''}</Text>
            </View>

            <Pressable style={styles.iconBtn}>
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
    justifyContent: 'center',
  },
  title: {
    color: THEME.WHITE,
    // fontWeight: 'bold',
    fontSize: 16,
  },
});
