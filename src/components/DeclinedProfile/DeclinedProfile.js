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
    declinedUserData: {},
    declinedMessage: {},
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
      this.dtRef.off('child_added');
      this.dtRef.off('child_removed');
    }

    this.uid = this.props.context.user.uid;
    this.dtRef = database()
      .ref('Users/' + this.uid)
      .child('dt');

    this.dtRef.on('child_added', (snap) => {
      this.fetchData(snap.key, snap.val());
    });

    this.dtRef.on('child_removed', (snap) => {
      let declinedUserData = {...this.state.declinedUserData};
      delete declinedUserData[snap.val()];

      let declinedMessage = {...this.state.declinedMessage};
      delete declinedMessage[snap.val()];

      this.setState({declinedMessage, declinedUserData});
    });
  };

  fetchData = async (nid, ouid) => {
    let {user} = this.props.context;
    let uid = user.uid;

    let uid1 = uid < ouid ? uid : ouid;
    let uid2 = uid > ouid ? uid : ouid;

    let refKey = uid1 + uid2;

    let data = await database()
      .ref('Users/' + ouid)
      .once('value');
    let message = await database()
      .ref('Users/' + this.uid)
      .child('rm')
      .child(nid)
      .once('value');

    let chat = await database().ref(`conversation/${refKey}`).once('value');

    let declinedUserData = {...this.state.declinedUserData};
    declinedUserData[ouid] = data.val();
    declinedUserData[ouid]['chat'] = chat.val();

    let declinedMessage = {...this.state.declinedMessage};
    declinedMessage[ouid] = message.val();

    this.setState({declinedMessage, declinedUserData});
  };

  renderMessageReq = () => {
    let data = this.state.declinedUserData;

    if (Object.keys(data).length == 0) return null;
    return (
      <FlatList
        data={Object.keys(data)}
        renderItem={({item}) => {
          let chat = this.state.declinedUserData[item].chat;
          return (
            <Cards
              data={data[item]}
              hideButton={true}
              sent={this.state.tab == 1}
              message={chat.lm.mg}
              fromDeclined={true}
              navigation={this.props.navigation}
              likesMe={this.LikesMe(data[item])}
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
      this.dtRef.off('child_added');
      this.dtRef.off('child_removed');
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
