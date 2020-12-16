import React from 'react';
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
    this.setState({loading: true});
    this._getChatReqs();
    if (this.props.route.params.id) {
      let id = this.props.route.params.id;
      if (id == 'Regular' || id == 'default') {
        this.setState({tab: 0});
      }

      if (id == 'Filtered Out') {
        this.setState({tab: 1});
      }
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
    if (this.consListerner) {
      this.consListerner.off('value');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let tab = this.props.route.params.id;
    let prevTab = prevProps.route.params.id;

    // console.log('update!', tab, prevTab);

    if (tab !== prevTab) {
      if (tab == 'Regular' || tab == 'default') {
        this.setState({tab: 0});
      }

      if (tab == 'Filtered Out') {
        this.setState({tab: 1});
      }
    }
  }

  _declineChat = (refKey) => {
    let {context, navigation} = this.props;
    let {user} = context;

    let ouid = refKey.split(user.uid).join('');

    database()
      .ref(`conversation/${refKey}`)
      .remove()
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat conversation remove err: ', err);
      });

    database()
      .ref(`messages/${refKey}`)
      .remove()
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat messages remove err: ', err);
      });

    database()
      .ref(`Users/${user.uid}/con/${refKey}`)
      .remove()
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat user/con remove err: ', err);
      });

    database()
      .ref(`Users/${ouid}/con/${refKey}`)
      .remove()
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat ouser/con remove err: ', err);
      });

    // if (navigation.canGoBack()) {
    //   navigation.pop();
    // }
  };

  _getChatReqs = () => {
    let {user} = this.props.context;
    let {con} = user;

    // if (con && con.length) {
    // console.log('offline ', con);
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
        // console.log(conSnap);
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
          if (!chatSnap.exists) {
            continue;
          }

          let chat = chatSnap.val();
          if (chat.isAcc || (chat.inR && chat.inR.uid === user.uid)) {
            continue;
          }
          let ouid = con.split(user.uid).join('');
          // check if blocked!
          // console.log(user.bt);
          if (user.bb && user.bb[ouid]) {
            continue;
          }
          // check if blocked!
          let cUserSnap = await database()
            .ref(`Users/${ouid}`)
            .once('value')
            .catch((err) => console.log('chats.js _getChats cUser err: ', err));
          if (!cUserSnap.exists) {
            continue;
          }
          let cUser = cUserSnap.val();
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

        console.log('regular: ', regular.length, 'filtered: ', filtered.length);
        this._isMounted &&
          this.setState({regular, filtered, rqsts, loading: false});
      },
      (err) => {
        console.log('chats.js _getChats err: ', err);
        this.setState({loading: false});
      },
    );
    // }
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
          }}
          pressParam={0}
        />
        <BUTTON_WITH_PARAM
          style={{width: '40%'}}
          text={'Filtered Out'}
          checked={!(tab == 0)}
          _onPress={() => {
            this.setState({tab: 1});
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
    let {tab, regular, filtered, rqsts, loading} = this.state;
    let data = rqsts.filter((r) => r.type === 'regular');
    if (tab) {
      data = rqsts.filter((r) => r.type === 'filtered');
    }

    return (
      <View style={styles.container}>
        <Header title={'Chat Requests'} type {...this.props} />
        {this._renderTab()}
        {loading ? (
          <ActivityIndicator
            size={27}
            color={THEME.ACTIVE_COLOR}
            style={{marginTop: 5, marginBottom: 5}}
          />
        ) : null}
        <FlatList
          data={data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderCard}
          style={{flex: 1}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
