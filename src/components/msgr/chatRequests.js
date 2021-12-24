import  React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Header from '../Headers/SettingsHeader';
import database from '@react-native-firebase/database';
import DateHelpers from '../../helpers/datehelpers';
import {BUTTON_WITH_PARAM} from '../general/button';
import Cards from '../cards/cards';
import moment from 'moment';
import THEME from '../../config/theme';

import Loader from '../modals/loaders';

import {CommonActions} from '@react-navigation/native';
import CardShimmer from '../cards/cardShimmer';
import { ShimmerLoader } from '../ShimmerLoader/ShimmerLoader';

export default class ChatRqsts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      rqsts: [],
      regular: [],
      filtered: [],
      loading: false,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    // this.setState({loading: true});
    this._getChatReqs();
    if (this.props.route.params.tab) {
      let tab = this.props.route.params.tab;
      if (tab == 'Regular' || tab == 'default') {
        this.setState({tab: 0});
      }

      if (tab == 'Filtered Out') {
        this.setState({tab: 1});
      }
    }

    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        this.setState({loading : false})
        let {route} = this.props;
        if (route.params && route.params.from === 'ref') {
          this._getChatReqs();
          // this._seenChats();
          console.log('chats requests return!');
        }
      },
    );
    this.didBlurSubscription = this.props.navigation.addListener(
      'blur',
      (payload) => {
        this.setState({loading : true})
        this.props.navigation.dispatch(CommonActions.setParams({from: ''}));
      },
    );
  }

  _seenChats = () => {
    let {user} = this.props.context;
    let cons = JSON.parse(JSON.stringify(user.con));

    if (cons) {
      let con = Object.keys(user.con);
      con.forEach((c) => {
        if (!cons[c].sn) {
          database().ref(`Users/${user.uid}/con/${c}/sn`).set(1);
        }
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    if (this.consListerner) {
      this.consListerner.off('value');
    }
    this.didFocusSubscription && this.didFocusSubscription();
    this.didBlurSubscription && this.didBlurSubscription();
  }

  filterShimmer = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ShimmerLoader
          styles={{
            height: 55,
            width: '35%',
            borderRadius: 30,
            marginHorizontal: 20,
          }}
        />
        <ShimmerLoader
          styles={{
            height: 55,
            width: '35%',
            borderRadius: 30,
            marginHorizontal: 20,
          }}
        />
      </View>
    );
  };

  componentDidUpdate(prevProps, prevState) {
    let tab = this.props.route.params.tab;
    let prevTab = prevProps.route.params.tab;

    // console.log('update!', tab, prevTab);

    if (tab !== prevTab) {
      if (tab == 'Regular' || tab == 'default') {
        this.setState({tab: 0});
      }

      if (tab == 'Filtered Out') {
        this.setState({tab: 1});
      }
    } else {
      // if ((tab == 'Regular' || tab == 'default') && this.state.tab !== 0) {
      //   this.setState({tab: 0});
      // }
      // if (tab == 'Filtered Out' && this.state.tab !== 1) {
      //   this.setState({tab: 1});
      // }
    }
  }

  _declineChat = async (refKey, ouser) => {
    let {context, navigation} = this.props;
    let {user} = context;
    let uid = user.uid;
    let ouid = ouser.uid;
    let onid = ouser.nid;

    let {rqsts} = this.state;

    let rIdx = rqsts.findIndex((r) => r.refKey === refKey);
    if (rIdx > -1) {
      rqsts.splice(rIdx, 1);
      this.setState({rqsts});
    }

    database()
      .ref(`conversation/${refKey}`)
      .update({
        dlT: new Date().getTime() / 1000,
        isAcc: -1,
      })
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat user/con remove err: ', err);
      });

    database()
      .ref(`Users/${user.uid}/con/${refKey}`)
      .update({
        lT: new Date().getTime() / 1000,
        uc: 0,
        isAcc: -1,
      })
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat user/con remove err: ', err);
      });

    database()
      .ref(`Users/${ouid}/con/${refKey}`)
      .update({
        lT: new Date().getTime() / 1000,
        isAcc: -1,
      })
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat ouser/con remove err: ', err);
      });

    database()
      .ref(`Users/${uid}/lf/${ouid}`)
      .remove()
      .catch((err) => {
        console.log('chatRequests.js _declineChat user/lf remove err: ', err);
      });

    database()
      .ref(`Users/${ouid}/lf/${uid}`)
      .remove()
      .catch((err) => {
        console.log('chatRequests.js _declineChat ouser/lf remove err: ', err);
      });

    database()
      .ref(`Users/${uid}/lt/${ouid}`)
      .remove()
      .catch((err) => {
        console.log('chatRequests.js _declineChat user/lt remove err: ', err);
      });

    database()
      .ref(`Users/${ouid}/lt/${uid}`)
      .remove()
      .catch((err) => {
        console.log('chatRequests.js _declineChat ouser/lt remove err: ', err);
      });
  };

  _getChatReqs = () => {
    let {user} = this.props.context;
    let {con} = user;

    if (this.consListerner) {
      this.consListerner.off('value');
    }
    this._isMounted && this.setState({loading: true});

    this.consListerner = database()
      .ref(`Users/${user.uid}`)
      .child('con')
      .orderByChild('lT')
      .limitToLast(15);
    this.consListerner.on(
      'value',
      async (conSnap) => {
        let regular = [];
        let filtered = [];
        let rqsts = [];
        // console.log('snap!: ', conSnap);
        // console.log('snap!', conSnap.val());
        let cons = conSnap.val();

        if (!cons) {
          this._isMounted &&
            this.setState({
              regular: [],
              rqsts: [],
              filtered: [],
              loading: false,
            });
          return;
        }

        let conKeys = Object.keys(cons);
        for (let con of conKeys) {
          let chatSnap = await database()
            .ref(`conversation/${con}`)
            .once('value')
            .catch((err) =>
              console.log('chats.js _getChats chat conGeterr: ', err),
            );
          if (!chatSnap.exists()) {
            let rqs = this.state.rqsts;
            rqs.filter((r) => r.refKey !== con);
            this.setState({rqsts: rqs, loading: false});
            continue;
          }

          let chat = chatSnap.val();
          if (
            chat.isAcc ||
            chat.isAcc === -1 ||
            (chat.inR && chat.inR.uid === user.uid)
          ) {
            continue;
          }
          let ouid = con.split(user.uid).join('');
          // check if blocked!
          // console.log(user.bt);

          let cUserSnap = await database()
            .ref(`Users/${ouid}`)
            .once('value')
            .catch((err) => console.log('chats.js _getChats cUser err: ', err));
          if (
            !cUserSnap.exists ||
            cUserSnap.val() === null ||
            cUserSnap.val().uid === undefined
          ) {
            continue;
          }
          let cUser = cUserSnap.val();

          if (cUser.bb && cUser.bb[user.uid]) {
            continue;
          }
          // check if blocked by user!
          if (cUser.bt && cUser.bt[user.uid]) {
            continue;
          }

          chat['cUser'] = cUser;
          chat['refKey'] = con;
          let filter = this._isMyType(user, cUser);
          if (filter) {
            // regular.push(chat);
            chat['type'] = 'regular';
          } else {
            // filtered.push(chat);
            chat['type'] = 'filtered';
          }
          rqsts.push(chat);
        }

        rqsts.sort((a, b) => b.lm.tp * 1000 - a.lm.tp * 1000);

        // console.log('regular: ', regular.length, 'filtered: ', filtered.length);
        this._isMounted &&
          this.setState({regular, filtered, rqsts, loading: false});
      },
      (err) => {
        console.log('chats.js _getChats err: ', err);
        this.setState({loading: false});
      },
    );
  };

  _isMyType = (user_data, data) => {
    let preference = user_data.pp;

    let minAge = preference.a1;
    let maxAge = preference.a2;
    let sc = preference.sc.split(',');
    let rl = preference.rl.split(',');
    let c = preference.c.split(',');
    let ms = preference.ms.split(',');

    let userAge = DateHelpers.getAge(data.dob);

    if (
      parseInt(userAge) < parseInt(minAge) ||
      parseInt(userAge) > parseInt(maxAge)
    ) {
      return false;
    }

    if (user_data.g == data.g) {
      return false;
    }

    if (!sc.includes(data.sc) && preference.sc != "Doesn't matter") {
      return false;
    }

    if (!rl.includes(data.rl) && preference.rl != "Doesn't matter") {
      return false;
    }

    if (!c.includes(data.c) && preference.c != "Doesn't matter") {
      return false;
    }

    if (!ms.includes(data.ms) && preference.ms != "Doesn't matter") {
      return false;
    }

    if (user_data.bt && Object.keys(user_data.bt).includes(data.uid)) {
      return false;
    }

    if (user_data.bb && Object.keys(user_data.bb).includes(data.uid)) {
      return false;
    }

    return true;
  };

  _renderTab = () => {
    let {tab} = this.state;
    let {navigation} = this.props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 20,
        }}>
        <BUTTON_WITH_PARAM
          text={'Regular'}
          style={{width: '40%'}}
          checked={tab == 0}
          _onPress={() => {
            this.setState({tab: 0});
            navigation.setParams({
              tab: 'Regular',
            });
          }}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          style={{width: '40%'}}
          text={'Filtered Out'}
          checked={!(tab == 0)}
          _onPress={() => {
            this.setState({tab: 1});
            navigation.setParams({
              tab: 'Filtered Out',
            });
          }}
          pressParam={1}
        />
      </View>
    );
  };

  _keyExtractor = (item, index) => {
    return index.toString();
  };

  _renderCard = ({item, index}) => {
    let {user} = this.props.context;
    let likes = user.lf ? Object.keys(user.lf) : 0;
    let chat = item;
    let likesMe = 0;
    if (likes) {
      likesMe = likes.indexOf(chat.cUser.uid);
      if (likesMe > -1) {
        likesMe = true;
      } else {
        likesMe = false;
      }
    }

    return (
      <Cards
        data={chat.cUser}
        hideButton={true}
        sent={this.state.tab == 1}
        message={chat.lm.mg}
        fromChat={true}
        navigation={this.props.navigation}
        likesMe={likesMe}
        dateToShow={moment(new Date(chat.lm.tp * 1000)).calendar()}
        messageRefKey={chat.refKey}
        fromPage={'Chat Request'}
        _declineChat={this._declineChat}
      />
    );
  };

  render() {
    let {tab, rqsts, loading} = this.state;
    let data = rqsts.filter((r) => r.type === 'regular');
    if (tab) {
      data = rqsts.filter((r) => r.type === 'filtered');
    }

    console.log('my chat data is', data)

    return (
      <View style={styles.container}>
        <Header title={'Chat Requests'} type {...this.props} />
        {/*{this._renderTab()}*/}
        {/*<FlatList*/}
        {/*  data={data}*/}
        {/*  extraData={data}*/}
        {/*  keyExtractor={this._keyExtractor}*/}
        {/*  renderItem={this._renderCard}*/}
        {/*  style={{flex: 1}}*/}
        {/*/>*/}
        {/*{loading ? <Loader isVisible={loading} /> : null}*/}
        {loading ? (
          <>
       { this.filterShimmer()}
          <CardShimmer request = {true} />
          </>
        ) : (
          <>
            {this._renderTab()}
            <FlatList
              data={data}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderCard}
              style={{flex: 1}}
            />
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
