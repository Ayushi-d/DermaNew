import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class BlockUser extends React.Component {
  blockUser = async () => {
    let uid = auth().currentUser && auth().currentUser.uid;
    let blockuid = this.props.userToBlock;

    let ref = await database()
      .ref('/dermaAndroid/users/' + uid)
      .child('bt')
      .child(blockuid)
      .set(1);

    let likeToRef = await database()
      .ref('/dermaAndroid/users/' + uid)
      .child('lt')
      .child(blockuid)
      .set(null);

    let lifeFromRef = await database()
      .ref('/dermaAndroid/users/' + uid)
      .child('lf')
      .child(blockuid)
      .set(null)

    // other user

    await database()
      .ref('/dermaAndroid/users/' + blockuid)
      .child('bb')
      .child(uid)
      .set(1);

    await database()
      .ref('/dermaAndroid/users/' + blockuid)
      .child('lt')
      .child(uid)
      .set(null);

    await database()
      .ref('/dermaAndroid/users/' + blockuid)
      .child('lf')
      .child(uid)
      .set(null);

    this.props.blockToggle();
  };
  render() {
    return (
      <ReactNativeModal
        isVisible={this.props.isVisible}
        style={{margin: 0, alignItems: 'center'}}
      >
        <View style={style.container}>
          <LinearGradient
            colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
            style={[style.header]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <Text style={style.heading}>BLOCK</Text>
          </LinearGradient>
          <View style={{backgroundColor: THEME.WHITE, padding: 20}}>
            <Text style={{textAlign: 'center', fontSize: 16}}>
              Block users will not be able to view your profile or contact you.
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: 30,
              }}
            >
              <BUTTON_WITH_PARAM
                text={'CANCEL'}
                style={{width: '40%'}}
                _onPress={() => this.props.blockToggle()}
              />
              <DEFAULT_BUTTON
                text={'BLOCK'}
                style={{width: '40%', marginLeft: 10}}
                _onPress={this.blockUser}
              />
            </View>
          </View>
        </View>
      </ReactNativeModal>
    );
  }
}

const style = StyleSheet.create({
  container: {
    width: '90%',
  },
  header: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  heading: {
    color: THEME.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BlockUser;
