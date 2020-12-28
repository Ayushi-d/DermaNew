import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../config/theme';
import DEFAULT_BUTTON, {BUTTON_WITH_PARAM} from '../general/button';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Loader from './loaders';

class BlockUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  blockUser = async () => {
    let {user} = this.props.context;
    let uid = auth().currentUser && auth().currentUser.uid;
    let blockuid = this.props.userToBlock;
    this.setState({loading: true});

    let ref = await database()
      .ref('Users/' + uid)
      .child('bt')
      .child(blockuid)
      .set(database.ServerValue.TIMESTAMP);

    let likeToRef = await database()
      .ref('Users/' + uid)
      .child('lt')
      .child(blockuid)
      .set(null);

    let lifeFromRef = await database()
      .ref('Users/' + uid)
      .child('lf')
      .child(blockuid)
      .set(null);

    // other user

    await database()
      .ref('Users/' + blockuid)
      .child('bb')
      .child(uid)
      .set(database.ServerValue.TIMESTAMP);

    await database()
      .ref('Users/' + blockuid)
      .child('lt')
      .child(uid)
      .set(null);

    await database()
      .ref('Users/' + blockuid)
      .child('lf')
      .child(uid)
      .set(null);

    let ouid = blockuid;

    let uid1 = uid < ouid ? uid : ouid;
    let uid2 = uid > ouid ? uid : ouid;
    let refKey = uid1 + uid2;

    if (user.con && user.con[refKey]) {
      console.log('updatingCon!');
      await database()
        .ref('Users/' + uid)
        .child('con')
        .child(refKey)
        .update({
          lT: new Date().getTime() / 1000,
          uc: 0,
          sn: 1,
        });
      await database()
        .ref('Users/' + ouid)
        .child('con')
        .child(refKey)
        .update({
          lT: new Date().getTime() / 1000,
          uc: 0,
          sn: 1,
        });
    }

    this.setState({loading: false});

    this.props.blockToggle();
    this.props.navigation.pop();
    alert('User Blocked!');
  };
  render() {
    let {loading} = this.state;
    return (
      <ReactNativeModal
        isVisible={this.props.isVisible}
        style={{margin: 0, alignItems: 'center'}}>
        <View style={style.container}>
          <LinearGradient
            colors={[...THEME.GRADIENT_BG.PAIR].reverse()}
            style={[style.header]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
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
              }}>
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
        {loading ? <Loader isVisible={loading} /> : null}
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
