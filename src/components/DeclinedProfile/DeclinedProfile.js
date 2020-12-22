import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {HeaderMain} from '../general/Header';

import database from '@react-native-firebase/database';
import Cards from '../cards/cards';
import {BUTTON_WITH_PARAM} from '../general/button';
import Header from '../Headers/SettingsHeader';

import moment from 'moment';

import {CommonActions} from '@react-navigation/native';
class DeclinedProfileJSX extends React.Component {
  state = {
    declinedUsers: [],
    tab: 0,
  };

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue});
  };

  componentDidMount() {
    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        if (route.params && route.params.from === 'ref') {
          this._getDec();
          console.log('declinedProfile return!');
        }
      },
    );
    this.didBlurSubscription = this.props.navigation.addListener(
      'blur',
      (payload) => {
        this.props.navigation.dispatch(CommonActions.setParams({from: ''}));
      },
    );
  }

  _getDec = () => {
    if (this.dtRef) {
      this.dtRef.off('value');
    }

    this.uid = this.props.context.user.uid;
    this.dtRef = database()
      .ref('Users/' + this.uid)
      .child('con')
      .orderByChild('lT');

    this.dtRef.on('value', async (snap) => {
      // console.log(snap.val());
      let allChats = [];
      let chats = snap.val();
      let dKeys = Object.keys(chats);
      for (let dk of dKeys) {
        let c = chats[dk];
        let cht = await database().ref(`conversation/${dk}`).once('value');
        if (!cht.exists || cht.val() === null) {
          continue;
        }
        let chat = cht.val();
        if (
          (chat.isAcc && chat.isAcc !== -1) ||
          (chat.inR && chat.inR.uid === this.uid)
        ) {
          continue;
        }
        let ouid = dk.split(this.uid).join('');
        let cUser = await database().ref(`Users/${ouid}`).once('value');
        if (!cUser.exists || cUser.val() === null) {
          continue;
        }
        chat['cUser'] = cUser.val();
        allChats.push(chat);
      }
      allChats.sort((a, b) => b.lm.tp * 1000 - a.lm.tp * 1000);
      this.setState({declinedUsers: allChats});
      // this.fetchData(snap.key, snap.val());
    });
  };

  renderMessageReq = () => {
    let {declinedUsers} = this.state;
    // let {dKeys} = this.state;
    // console.log(dKeys);

    if (declinedUsers.length == 0) return null;
    return (
      <FlatList
        data={declinedUsers}
        renderItem={({item}) => {
          let chat = item;
          return (
            <Cards
              data={chat.cUser}
              hideButton={true}
              sent={this.state.tab == 1}
              message={chat.lm.mg}
              fromDeclined={true}
              navigation={this.props.navigation}
              likesMe={this.LikesMe(chat.cUser)}
              dateToShow={moment(new Date(chat.lm.tp * 1000)).calendar()}
              messageRefKey={chat.refKey}
              fromPage={'Decline Profile'}
            />
          );
        }}
        keyExtractor={(item, index) => index.toString()}
        style={{flexGrow: 1}}
      />
    );
  };

  LikesMe = (data) => {
    let lt = this.props.context.user.lt;
    if (lt && data) {
      return Object.keys(lt).includes(data.uid);
    }
    return false;
  };

  componentWillUnmount() {
    if (this.dtRef) {
      this.dtRef.off('value');
      // this.dtRef.off('child_removed');
    }
    this.didFocusSubscription && this.didFocusSubscription();
    this.didBlurSubscription && this.didBlurSubscription();
  }

  renderTab = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 20,
        }}>
        <BUTTON_WITH_PARAM
          text={'BY ME'}
          style={{width: '40%'}}
          checked={this.state.tab == 0}
          _onPress={this._onTabPress}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          style={{width: '40%'}}
          text={'BY OTHERS'}
          checked={!(this.state.tab == 0)}
          _onPress={this._onTabPress}
          pressParam={1}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header title="Declined Profile" type {...this.props} />
        {this.renderTab()}
        {this.renderMessageReq()}
      </View>
    );
  }
}

const DeclinedProfile = (props) => <DeclinedProfileJSX {...props} />;

export default DeclinedProfile;
