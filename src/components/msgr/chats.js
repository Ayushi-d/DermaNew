import React from 'react';
import {View, Text, Image, FlatList, Pressable, StyleSheet} from 'react-native';
import Header from '../Headers/SettingsHeader';
import database from '@react-native-firebase/database';
import THEME from '../../config/theme';
import LinearGradient from 'react-native-linear-gradient';

import {CommonActions} from '@react-navigation/native';
import ChatShimmer from '../chat/ChatShimmer';

import moment from 'moment';

import Loader from '../modals/loaders';

moment.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: 'LT',
    nextDay: '[Tomorrow]',
    lastWeek: 'll',
    nextWeek: 'll',
    sameElse: 'll',
  },
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    l: 'D/M/YYYY',
    LL: 'Do MMMM YYYY',
    ll: 'MMM D, YYYY',
    LLL: 'Do MMMM YYYY LT',
    lll: 'D MMM YYYY LT',
    LLLL: 'dddd, MMMM Do YYYY LT',
    llll: 'ddd, MMM D YYYY LT',
  },
});

export default class Chats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      loading: false,
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this._getChats();

    this.didFocusSubscription = this.props.navigation.addListener(
      'focus',
      (payload) => {
        let {route} = this.props;
        if (route.params && route.params.from === 'ref') {
          this._getChats();
          console.log('chats return!');
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

  _getChats = () => {
    let {user} = this.props.context;
    let {con} = user;

    if (this.consListerner) {
      this.consListerner.off('value');
    }

    // if (con && con.length) {
    // console.log('offline ', user.con);
    this._isMounted && this.setState({loading: true});
    this.consListerner = database()
      .ref(`Users/${user.uid}`)
      .child('con')
      .orderByChild('lT')
      .limitToLast(15);
    this.consListerner.on(
      'value',
      async (conSnap) => {
        let chats = [];
        // console.log(conSnap);
        // console.log('snap!', conSnap.val());
        let cons = conSnap.val();

        if (!cons) {
          this._isMounted && this.setState({chats: [], loading: false});
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
            let chts = this.state.chats;
            chts.filter((c) => c.refKey !== con);
            this.setState({chats: chts});
            continue;
          }
          let chat = chatSnap.val();

          if (chat.isAcc === -1) {
            continue;
          }

          if (chat.inR && chat.inR.uid !== user.uid) {
            if (!chat.isAcc) {
              continue;
            }
          }
          let ouid = con.split(user.uid).join('');

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
          // console.log(cUser);

          // check if blocked by ouser!
          if (cUser.bb && cUser.bb[user.uid]) {
            continue;
          }
          // check if blocked by user!
          if (cUser.bt && cUser.bt[user.uid]) {
            continue;
          }

          chat['cUser'] = cUser;
          chat['refKey'] = con;

          chats.sort((a, b) => b.lm.tp * 1000 - a.lm.tp * 1000);

          chats.push(chat);
        }

        // console.log('chats: ', chats.length);
        this._isMounted && this.setState({chats, loading: false});
      },
      (err) => {
        console.log('chats.js _getChats err: ', err);
        this._isMounted && this.setState({loading: false});
      },
    );
    // }
  };

  componentWillUnmount() {
    this._isMounted = false;
    if (this.consListerner) {
      this.consListerner.off('value');
    }
    this.didFocusSubscription && this.didFocusSubscription();
    this.didBlurSubscription && this.didBlurSubscription();
  }

  _keyExtractor = (item, index) => {
    return index.toString();
  };

  _renderChat = ({item, index}) => <RenderChat chat={item} {...this.props} />;

  render() {
    let {chats, loading} = this.state;
    return (
        <View style={styles.container}>
          <Header title={'Messages'} type {...this.props} />
          {loading ? (
              <ChatShimmer chat={true} />
          ) : (
              <FlatList
                  data={chats}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderChat}
                  style={{flex: 1}}
              />
          )}
        </View>
    );
  }
}

function RenderChat(props) {
  let {chat, context, navigation} = props;
  let {cUser, lm} = chat;
  let {user} = context;

  let unRead = chat[user.uid].uc;

  return (
    <Pressable
      style={styles.chatCon}
      onPress={() => {
        navigation.navigate('Message', {
          data: {
            otheruser: chat.cUser,
            refKey: chat.refKey,
            from: '',
            member: '',
          },
          fromPage: '',
        });
      }}>
      <View style={styles.chatConIn}>
        <View style={styles.propicCon}>
          <Image source={{uri: cUser.dp}} style={styles.propic} />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatContentTop}>
            <Text
              style={{...styles.name, fontWeight: unRead ? 'bold' : 'normal'}}>
              {cUser.sn}
            </Text>
            {/*<View style={styles.tScore}>*/}
            {/*  <Text style={styles.tScoreTxt}>Trust Score</Text>*/}
            {/*  <LinearGradient*/}
            {/*    colors={THEME.GRADIENT_BG.PAIR}*/}
            {/*    style={styles.tScoreCount}>*/}
            {/*    <Text style={styles.tScoreCountTxt}>{cUser.ts.ts}%</Text>*/}
            {/*  </LinearGradient>*/}
            {/*</View>*/}
            <Text style={styles.cTime}>
              {moment(new Date(lm.tp * 1000)).calendar()}
            </Text>
          </View>
        </View>
      </View>
      <View style={{...styles.chatBottomCon, marginLeft: 60, paddingRight: 5}}>
        <Text
          style={{...styles.lMsg, fontWeight: unRead ? 'bold' : 'normal'}}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {lm.sid === user.uid ? 'You: ' : `${cUser.sn.split(' ')[0]}:`} {lm.mg}
        </Text>
        {chat[user.uid] && chat[user.uid].uc ? (
          <Text style={styles.countBubble}>{chat[user.uid].uc}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // RENDER CHAT
  chatCon: {
    flex: 1,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#777',
  },
  chatConIn: {
    flex: 1,
    paddingLeft: 7,
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  propicCon: {
    // padding: 5,
    // paddingBottom: 0,
  },
  propic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatContent: {
    flex: 1,
    padding: 7,
    justifyContent: 'center',
  },
  chatContentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingRight: 7,
  },
  name: {
    flex: 1,
    fontSize: 15,
  },
  tScore: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: THEME.GRADIENT_BG.END_COLOR,
  },
  tScoreTxt: {
    paddingHorizontal: 4,
    textAlignVertical: 'center',
    fontSize: 13,
  },
  tScoreCount: {
    padding: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tScoreCountTxt: {
    color: THEME.WHITE,
    fontSize: 13,
  },

  cTime: {
    paddingLeft: 5,
    fontSize: 13,
  },

  // chat bottom
  chatBottomCon: {
    // marginLeft: 47,
    paddingBottom: 5,
    flexDirection: 'row',
  },
  lMsg: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  countBubble: {
    fontSize: 10,
    paddingHorizontal: 6,
    textAlignVertical: 'center',
    color: '#fff',
    borderRadius: 20,
    backgroundColor: THEME.ACTIVE_COLOR,
  },
});
