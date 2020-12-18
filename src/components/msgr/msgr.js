import React from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MsgHeader from '../Headers/msgHeader';
import MsgBox from './msgBox';
import database from '@react-native-firebase/database';

import THEME from '../../config/theme';

import moment from 'moment';

export default class Msgr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatCheck: false,
      chatExists: false,
      chat: [],
      msgs: [],
    };
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    let {params} = this.props.route;
    let oUser = params.data.otheruser;
    let {refKey} = params.data;
    this._checkIfChatExists(refKey);

    this._chatListener(refKey);
  }

  _chatListener = (refKey) => {
    let {navigation} = this.props;

    this.listenChat = database().ref(`conversation/${refKey}`);
    this.listenChat.on(
      'value',
      (chatSnap) => {
        if (chatSnap) {
          if (chatSnap.val() !== null) {
            this._isMounted &&
              this.setState({chat: chatSnap.val(), chatExists: true});
          }
        } else {
          if (navigation.canGoBack()) {
            navigation.pop();
          }
        }
      },
      (err) => console.log('msgr.js _chatListener err: ', err),
    );
  };

  _checkIfChatExists = (refKey) => {
    let {params} = this.props.route;
    // let oUser = params.data.otheruser;
    let {navigation} = this.props;

    database()
      .ref(`conversation/${refKey}`)
      .once(
        'value',
        (chatSnap) => {
          if (chatSnap.exists()) {
            // console.log(chatSnap);
            this._isMounted &&
              this.setState({
                chatExists: true,
                chat: chatSnap.val(),
                chatCheck: true,
              });
            this._getInitMsgs(refKey);
          } else {
            this._isMounted &&
              this.setState({chatExists: false, chatCheck: true});
          }
        },
        (err) => {
          console.log('msgr.js, _checkIfChatExists err: ', err);
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      );
  };

  _getInitMsgs = (refKey) => {
    this.msgsRef = database().ref(`messages/${refKey}`);
    this.msgsRef
      .orderByChild('tp')
      .limitToLast(25)
      .once(
        'value',
        (msgsSnap) => {
          let msgs = [];
          msgsSnap.forEach((msgSnap) => {
            let msg = msgSnap.val();
            msg.mid = msgSnap.key;
            msgs.push(msg);
          });
          msgs = msgs.reverse();
          this._isMounted && this.setState({msgs});

          this._getMsgs(refKey, msgs[0]);
          this._seen(refKey);
        },
        (err) => {
          console.log('msgr.js _getMsgs err: ', err);
        },
      );
  };

  _getMsgs = (refKey, after) => {
    // console.log(after);
    this.msgsRef = database().ref(`messages/${refKey}`);
    this.msgsRef
      .startAt(after ? parseInt(after.tp) + 1 : 0)
      .orderByChild('tp')
      // .startAt(after)
      .limitToLast(5)
      .on(
        'child_added',
        (msgSnap) => {
          // console.log('msgs: ', msgSnap);
          let {msgs} = this.state;
          msgs.unshift(msgSnap.val());
          this._isMounted && this.setState({msgs});
          this._seen(refKey);
        },
        (err) => {
          console.log('msgr.js _getMsgs err: ', err);
        },
      );
  };

  _seen = (refKey) => {
    let {user} = this.props.context;
    let uid = user.uid;
    let {chat} = this.state;
    if (user.con) {
      // console.log('ref', user.con[refKey]);
    }

    if (user.con && Object.keys(user.con).indexOf(refKey) > -1) {
      // console.log(user.uid, 'sent to me!');
      database()
        .ref(`Users/${uid}/con/${refKey}`)
        .update({
          sn: 1,
          uc: 0,
        })
        .then(() => {
          console.log('msgs seen!');
        })
        .catch((err) => {
          console.log('msgr.js _seen request error', err);
        });
    }

    database()
      .ref(`conversation/${refKey}/${uid}`)
      .update({
        uc: 0,
      })
      .then(() => {
        // console.log('msgBox _send conversation uc updated.');
      })
      .catch((err) => {
        console.log('msgr.js _seen  err: ', err);
      });
  };

  _sendChatRequest = async (rMsg) => {
    let {params} = this.props.route;
    let oUser = params.data.otheruser;
    let ouid = oUser.uid;

    let {user} = this.props.context;
    let uid = user.uid;

    let {refKey} = params.data;
    let {navigation} = this.props;

    this._isMounted && this.setState({sendingReq: true});

    let uid1 = uid < ouid ? uid : ouid;
    let uid2 = uid > ouid ? uid : ouid;

    let dat = {};
    dat[uid1] = {
      status: 'away',
      uc: uid1 === uid ? 0 : 1,
    };
    dat[uid2] = {
      status: 'away',
      uc: uid2 === uid ? 0 : 1,
    };
    let reqData = {
      ...dat,
      inR: {
        tp: new Date().getTime() / 1000,
        uid: uid,
      },
      isAcc: 0,
      lm: rMsg,
    };

    return new Promise((resolve, reject) => {
      if (this.state.sendingReq) {
        reject('already trying to send a request!');
      }
      let sendRequest = database().ref(`conversation/${refKey}`).set(reqData);
      sendRequest
        .then(() => {
          database()
            .ref(`Users/${ouid}/con/${refKey}`)
            .set({
              sn: 0,
              lT: new Date().getTime() / 1000,
            })
            .then(() => {
              // console.log('sent');
              this.setState({chat: reqData});
            })
            .catch((err) =>
              console.log('msgr.js _send con chat request err: ', err),
            );

          database()
            .ref(`Users/${uid}/con/${refKey}`)
            .set({
              sn: 1,
              lT: new Date().getTime() / 1000,
            })
            .then(() => {
              // console.log('sent');
              this.setState({chat: reqData});
            })
            .catch((err) =>
              console.log('msgr.js _send con chat uid request err: ', err),
            );

          this._isMounted &&
            this.setState({chatExists: true, sendingReq: false});
          resolve(true);
        })
        .catch((err) => {
          console.log('msgr.js _send chat request err: ', err);
          this._isMounted && this.setState({sendingReq: false});
          reject(err);
        });
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.msgsRef && this.msgsRef.off('child_added');
    this.listenChat && this.listenChat.off('value');
  }

  _keyExtractor = (item, index) => {
    return index.toString();
  };

  _accept = (refKey, ouid) => {
    let {fromPage} = this.props.route.params;
    console.log('accept!');
    console.log(fromPage);

    if (fromPage === 'Decline Profile') {
      this._unDecline();
    }

    database()
      .ref(`conversation/${refKey}`)
      .update({isAcc: 1})
      .then(() => {
        let {chat} = this.state;
        chat.isAcc = 1;
        this._isMounted && this.setState({chat});
      })
      .catch((err) => {
        console.log('msgr.js _accept err: ', err);
      });

    database()
      .ref(`Users/${ouid}/con/${refKey}`)
      .set({sn: 1})
      .then(() => {
        let {chat} = this.state;
        chat.isAcc = 1;
        this._isMounted && this.setState({chat});
      })
      .catch((err) => {
        console.log('msgr.js _accept ouser con err: ', err);
      });
  };

  _unDecline = () => {
    let {context, route} = this.props;
    let {user} = context;

    let oUser = route.params.data.otheruser;
    let uid = user.uid;
    let ouid = oUser.uid;
    let onid = oUser.nid;
    console.log('undecline!');
    database()
      .ref('Users')
      .child(uid)
      .child('rf')
      .child(onid.toString())
      .remove();

    // move the data to dt node of current user

    database()
      .ref('Users')
      .child(uid)
      .child('dt')
      .child(onid.toString())
      .remove();

    // add data to the db node of other user
    database().ref('Users').child(ouid).child('db').child(uid).remove();
  };

  _declineChat = () => {
    let {context, route, navigation} = this.props;
    let {user} = context;
    let {refKey} = route.params.data;
    let oUser = route.params.data.otheruser;
    let uid = user.uid;
    let ouid = oUser.uid;
    let onid = oUser.nid;

    database()
      .ref(`Users/${user.uid}/con/${refKey}`)
      .update({
        lT: new Date().getTime() / 1000,
      })
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat user/con remove err: ', err);
      });

    database()
      .ref(`Users/${ouid}/con/${refKey}`)
      .update({
        lT: new Date().getTime() / 1000,
      })
      .then(() => {})
      .catch((err) => {
        console.log('msgr.js _declineChat ouser/con remove err: ', err);
      });

    // delete from rf node of current user

    database()
      .ref('Users')
      .child(uid)
      .child('rf')
      .child(onid.toString())
      .set(null);

    // move the data to dt node of current user

    database()
      .ref('Users')
      .child(uid)
      .child('dt')
      .child(onid.toString())
      .set(ouid);

    // add data to the db node of other user
    database().ref('Users').child(ouid).child('db').child(uid).set(1);

    this._isMounted && this.setState({declined: true});
  };

  _renderMsg = ({item, index}) => {
    let {user} = this.props.context;
    let ouser = this.props.route.params.data.otheruser;
    // console.log(user.dp);
    let msg = item;
    let type = msg.sid === user.uid ? 0 : 1;
    return (
      <View
        style={{
          ...styles.msgCon,
          alignItems: type ? 'flex-start' : 'flex-end',
        }}>
        <View
          style={{
            ...styles.msgOut,
            alignItems: !type ? 'flex-start' : 'flex-end',
          }}>
          <View
            style={{
              ...styles.msg,
              flexDirection: type ? 'row' : 'row-reverse',
            }}>
            <Image
              source={{uri: type ? ouser.dp : user.dp}}
              style={{
                ...styles.propic,
              }}
            />
            {/* <View style={{flex: 1}}> */}
            <Text style={{...styles.msgTxt}}>{msg.mg}</Text>
            {/* </View> */}
          </View>
          <Text style={{...styles.msgTime}}>
            {moment(new Date(msg.tp * 1000)).format('LT')}
          </Text>
        </View>
      </View>
    );
  };

  _renderHeader = () => {
    let {chatCheck, chatExists, chat, msgs} = this.state;
    let {fromPage, data} = this.props.route.params;
    let ouser = data.otheruser;
    console.log('ouser: ', ouser);

    let {user} = this.props.context;

    // if (fromPage === 'Decline Profile') {
    //   return <></>;
    // }
    if (user.dt && user.dt[ouser.nid]) {
      return (
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            // backgroundColor: THEME.ACTIVE_COLOR,
          }}>
          <Text
            style={{
              color: '#000',
            }}>
            {`You have declined this user. \nSend a message to start conversation.`}
          </Text>
        </View>
      );
    }
    return (
      <>
        {!chatExists ||
        (chatExists &&
          (chat.isAcc || (chat.inR && chat.inR.uid === user.uid))) ? null : (
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              // backgroundColor: THEME.ACTIVE_COLOR,
            }}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.reply,
                {backgroundColor: THEME.GRADIENT_BG.END_COLOR},
              ]}
              onPress={this._declineChat}>
              <Text
                style={{
                  color: THEME.WHITE,
                  fontWeight: 'bold',
                }}>
                DECLINE
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  render() {
    let {chatCheck, chatExists, chat, msgs} = this.state;
    let {user} = this.props.context;
    // console.log(chat);
    return (
      <View style={styles.container}>
        <MsgHeader right {...this.props} />
        <FlatList
          data={msgs}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderMsg}
          ListHeaderComponent={this._renderHeader}
          inverted
          style={{flex: 1}}
        />
        {!chatCheck ? (
          <View style={{width: '100%', padding: 5}}>
            <ActivityIndicator size={'small'} color={THEME.ACTIVE_COLOR} />
          </View>
        ) : (
          <MsgBox
            chatCheck={chatCheck}
            chatExists={chatExists}
            chat={chat}
            _sendChatRequest={this._sendChatRequest}
            _getMsgs={this._getMsgs}
            _accept={this._accept}
            {...this.props}
          />
        )}
      </View>
    );
  }
}

function ReplyOrDecline(props) {
  return (
    <View
      style={{
        width: '100%',
        alignSelf: 'center',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: THEME.ACTIVE_COLOR,
      }}>
      <TouchableOpacity
        style={[styles.button, styles.reply]}
        onPress={props._replyToMessage}>
        <Text style={{color: THEME.GRADIENT_BG.END_COLOR, fontWeight: 'bold'}}>
          REPLY
        </Text>
      </TouchableOpacity>

      {/* {!this.props.fromDeclined ? ( */}
      <TouchableOpacity
        style={[styles.button, styles.decline]}
        onPress={props.declineMessage}>
        <Text style={{color: THEME.WHITE, fontWeight: 'bold'}}>DECLINE</Text>
      </TouchableOpacity>
      {/* ) : null} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  msgCon: {
    flex: 1,
    padding: 4,
  },
  msgOut: {
    maxWidth: '60%',
  },
  msg: {
    flex: 1,
    position: 'relative',
    maxWidth: '100%',
    padding: 9,
    paddingLeft: 30,
    // paddingHorizontal: 15,
    borderRadius: 3,
    backgroundColor: THEME.BUBBLE_BACKGROUND,
    justifyContent: 'center',
  },
  propic: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderRadius: 20,
    top: 7,
    left: 5,
    // margin: 5,
    // backgroundColor: '#fff',
  },
  msgTxt: {
    // padding: 3,
    // backgroundColor: '#fff',
    paddingHorizontal: 5,
    fontSize: 15,
  },
  msgTime: {
    fontSize: 10,
  },

  // BUTTONS
  reply: {
    backgroundColor: THEME.WHITE,
  },

  decline: {
    borderWidth: 1,
    borderColor: THEME.WHITE,
  },
  button: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
