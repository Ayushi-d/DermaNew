import React from 'react';
import {View, Text, Image, FlatList, Pressable, StyleSheet} from 'react-native';
import Header from '../Headers/SettingsHeader';
import database from '@react-native-firebase/database';
import THEME from '../../config/theme';
import LinearGradient from 'react-native-linear-gradient';

import moment from 'moment';

moment.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: 'LT',
    nextDay: '[Tomorrow]',
    lastWeek: 'dddd',
    nextWeek: 'dddd',
    sameElse: 'L',
  },
  longDateFormat: {
    LT: 'h:mm A',
    LTS: 'h:mm:ss A',
    L: 'DD/MM/YYYY',
    l: 'D/M/YYYY',
    LL: 'Do MMMM YYYY',
    ll: 'D MMM YYYY',
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
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this._getChats();
  }

  _getChats = () => {
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
        let chats = [];
        // console.log(conSnap);
        // console.log('snap!', conSnap.val());
        let cons = conSnap.val();
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
          if (!chat.isAcc) {
            continue;
          }
          let ouid = con.split(user.uid).join('');
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
          chats.push(chat);
        }

        // console.log('chats: ', chats.length);
        this._isMounted && this.setState({chats});
      },
      (err) => console.log('chats.js _getChats err: ', err),
    );
    // }
  };

  componentWillUnmount() {
    this._isMounted = false;
    if (this.consListerner) {
      this.consListerner.off('value');
    }
  }

  _keyExtractor = (item, index) => {
    return index.toString();
  };

  _renderChat = ({item, index}) => <RenderChat chat={item} {...this.props} />;

  render() {
    let {chats} = this.state;
    return (
      <View style={styles.container}>
        <Header title={'MESSAGES'} {...this.props} />

        <FlatList
          data={chats}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderChat}
          style={{flex: 1}}
        />
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
              {cUser.nm}
            </Text>
            <View style={styles.tScore}>
              <Text style={styles.tScoreTxt}>TRUST SCORE</Text>
              <LinearGradient
                colors={THEME.GRADIENT_BG.PAIR}
                style={styles.tScoreCount}>
                <Text style={styles.tScoreCountTxt}>20%</Text>
              </LinearGradient>
            </View>
            <Text style={styles.cTime}>
              {moment(new Date(lm.tp)).calendar()}
            </Text>
          </View>
          <View style={styles.chatBottomCon}>
            <Text
              style={{...styles.lMsg, fontWeight: unRead ? 'bold' : 'normal'}}>
              {lm.sId === user.uid ? 'You: ' : `${cUser.nm.split(' ')[0]}:`}{' '}
              {lm.msg}
            </Text>
          </View>
        </View>
      </View>
      {/* <View style={styles.chatBottomCon}>
        <Text style={styles.lMsg}>
          {lm.sId === user.uid ? 'You: ' : `${cUser.nm.split(' ')[0]}:`}{' '}
          {lm.msg}
        </Text>
      </View> */}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // RENDER CHAT
  chatCon: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatConIn: {
    flex: 1,
    paddingLeft: 7,
    flexDirection: 'row',
    alignItems: 'center',
  },
  propicCon: {
    // padding: 5,
    // paddingBottom: 0,
  },
  propic: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  lMsg: {
    fontSize: 13,
    color: '#888',
  },
});
