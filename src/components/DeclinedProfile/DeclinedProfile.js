import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {HeaderMain} from '../general/Header';

import database from '@react-native-firebase/database';
import Cards from '../cards/cards';
import {BUTTON_WITH_PARAM} from '../general/button';
import Header from '../Headers/SettingsHeader';

import moment from 'moment';

import Loader from '../modals/loaders';

import {CommonActions} from '@react-navigation/native';
class DeclinedProfileJSX extends React.Component {
  state = {
    declinedUsers: [],
    tab: 0,
    loading: false,
  };

  _onTabPress = (tabValue) => {
    this.setState({tab: tabValue});
  };

  componentDidMount() {
    this._getDec();
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

    let {user} = this.props.context;

    this.setState({loading: true});

    this.uid = this.props.context.user.uid;
    this.dtRef = database()
      .ref('Users/' + this.uid)
      .child('con')
      .orderByChild('lT');

    if (!user.con) {
      this.setState({loading: false});
      return;
    }

    this.dtRef.on(
      'value',
      async (snap) => {
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
          if (!chat.isAcc || (chat.isAcc && chat.isAcc !== -1)) {
            continue;
          }
          let ouid = dk.split(this.uid).join('');
          let cUser = await database().ref(`Users/${ouid}`).once('value');
          if (!cUser.exists || cUser.val() === null) {
            continue;
          }
          let ouser = cUser.val();

          chat['cUser'] = ouser;

          if (ouser.bb && ouser.bb[user.uid]) {
            continue;
          }
          // check if blocked by user!
          if (ouser.bt && ouser.bt[user.uid]) {
            continue;
          }
          allChats.push(chat);
        }
        allChats.sort((a, b) => {
          console.log(b.dlt)
          return b.dlT * 1000 - a.dlT * 1000});
        this.setState({declinedUsers: allChats, loading: false});
        // this.fetchData(snap.key, snap.val());
      },
      (err) => {
        this.setState({loading: false});
        console.log('DeclinedProfile.js err: ', err);
      },
    );
  };

  renderMessageReq = () => {
    let {declinedUsers, tab} = this.state;
    // let {dKeys} = this.state;
    // console.log(dKeys);

    if (declinedUsers.length == 0) return null;

    // console.log(tab);

    if (!tab) {
      declinedUsers = declinedUsers.filter(
        (u) => u.inR && u.inR.uid !== this.uid,
      );
    } else {
      declinedUsers = declinedUsers.filter(
        (u) => u.inR && u.inR.uid === this.uid,
      );
    }
    return (
      <FlatList
        data={declinedUsers}
        renderItem={({item}) => {
          let chat = item;
          // console.log(chat);
          return (
            <Cards
              data={chat.cUser}
              hideButton={true}
              sent={this.state.tab == 1}
              message={chat.lm.mg}
              fromDeclined={true}
              declinedRef={tab}
              navigation={this.props.navigation}
              likesMe={this.LikesMe(chat.cUser)}
              dateToShow={moment(new Date(chat.dlT * 1000)).calendar()}
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
    let {loading} = this.state;
    return (
      <View style={{flex: 1}}>
        <Header title="Declined Profile" type {...this.props} />
        {this.renderTab()}
        {this.renderMessageReq()}
        {loading ? <Loader isVisible={loading} /> : null}
      </View>
    );
  }
}

const DeclinedProfile = (props) => <DeclinedProfileJSX {...props} />;

export default DeclinedProfile;
