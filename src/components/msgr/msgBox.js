import React from 'react';
import {View, Text, Pressable, TextInput, StyleSheet} from 'react-native';
import THEME from '../../config/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';

export default class MsgBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _send = () => {
    let {msg} = this.state;

    let {params} = this.props.route;
    let {context, chatExists, _sendChatRequest} = this.props;
    let {user} = context;
    let oUser = params.data.otheruser;
    let {refKey} = params.data;
    let {chat} = this.props;

    let uid = user.uid;
    let ouid = oUser.uid;

    let lMsg = {
      msg: msg,
      rid: ouid,
      sid: uid,
      tp: database.ServerValue.TIMESTAMP,
      x: 0,
    };

    if (!chatExists) {
      _sendChatRequest(lMsg)
        .then((res) => {
          if (res) {
            database()
              .ref(`messages/${refKey}`)
              .push(
                lMsg,
                (res) => {
                  console.log('msg sent!');
                  this._isMounted && this.setState({msg: ''});
                  this.props._getMsgs(refKey);
                },
                (err) => {
                  console.log('msgBox _send err: ', err);
                },
              );
          }
        })
        .catch((err) =>
          console.log('msgBox _send _sendChatRequest err: ', err),
        );
    } else {
      database()
        .ref(`messages/${refKey}`)
        .push(
          lMsg,
          (res) => {
            // console.log('msg sent!');
            this._isMounted && this.setState({msg: ''});
            database()
              .ref(`conversation/${refKey}`)
              .update({
                lm: lMsg,
              })
              .then(() => {
                // console.log('msgBox _send conversation lm updated.');
              })
              .catch((err) => {
                console.log('msgBox _send conversation lm update err: ', err);
              });
            database()
              .ref(`conversation/${refKey}/${ouid}`)
              .update({
                uc: database.ServerValue.increment(1),
              })
              .then(() => {
                // console.log('msgBox _send conversation uc updated.');
              })
              .catch((err) => {
                console.log('msgBox _send conversation uc update err: ', err);
              });

            if (!chat.isAcc && chat.inR.uid === uid) {
              console.log('sending again!');
              database()
                .ref(`Users/${ouid}/con/${refKey}/`)
                .update({
                  sn: 0,
                })
                .then(() => {
                  // console.log('msgBox _send conversation uc updated.');
                })
                .catch((err) => {
                  console.log(
                    'msgBox _send request again user con update err: ',
                    err,
                  );
                });
            }
          },
          (err) => {
            console.log('msgBox _send err: ', err);
          },
        );
    }
  };

  render() {
    let {msg} = this.state;
    return (
      <View style={{...styles.container}}>
        <View style={styles.txtInpCon}>
          <TextInput
            placeholder={'Type a message.'}
            placeholderTextColor={'#888'}
            onChangeText={(msg) => this.setState({msg})}
            value={msg}
            style={styles.txtInp}
            multiline
          />
        </View>
        <Pressable style={styles.sendBtn} onPress={this._send}>
          <Ionicons name={'ios-send-sharp'} color={THEME.WHITE} size={27} />
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'flex-end',
  },
  txtInpCon: {
    flex: 1,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: THEME.ACTIVE_COLOR,
    borderRadius: 30,
  },
  txtInp: {
    maxHeight: 70,
  },
  sendBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    width: 50,
    height: 50,
    backgroundColor: THEME.ACTIVE_COLOR,
    borderRadius: 25,
  },
});
