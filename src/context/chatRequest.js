import React from 'react';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import DateHelpers from '../helpers/datehelpers';

const ChatRequestContext = React.createContext();

class ChatRequestContextProvider extends React.Component {
  state = {
    regular: {},
    filteredOut: {},
    messageBoxData: {},
    currentUser: {},
  };

  componentDidMount() {
    this.uid = auth().currentUser.uid;
    this.addChatReqEvent();
    this.checkForChangesInPP();
  }

  componentWillUnmount() {
    // remove chatRefEvent Listener
    if (this.chatRef) {
      this.chatRef.off('child_added');
    }
    if (this.chatRefChanges) {
      this.chatRefChanges.off('child_changed');
    }

    if (this.currentUserRef) this.currentUserRef.off('child_changed');
  }

  addChatReqEvent = async () => {
    this.chatRef = database().ref(`Users/${this.uid}/con`);

    this.chatRef.on('child_added', async (res) => {
      // get label and otherUserData
      if (res.val() == -1 || res.key == 'rc') {
        return;
      }
      const data = await this.getLabel(res.key);
      this.assignLabel(data);
    });

    this.chatRefChanges = database().ref(`Users/${this.uid}/con`);

    this.chatRefChanges.on('child_changed', async (res) => {
      if (res.val() != 0 || res.key == 'rc') return;
      const data = await this.getLabel(res.key);
      this.assignLabel(data);
    });
  };

  getLabel = async (key) => {
    /*
      return whether chat request will be 'Regular' or 'Filtered Out' and other user data with last Message
      0 -> Regular
      1 -> Filtered Out

    */

    try {
      const otherUID = key.split(this.uid).join('');

      // check if inR.uid == otherUID
      const conv = await database().ref(`conversation/${key}`).once('value');
      let con = conv.val();

      if (!con && !con.inR) return false;
      if (con.inR.uid != otherUID || con.isAcc) {
        return null;
      }

      const currentUserData = await this.fetchCurrentUserData();

      const otherUserData = await database()
        .ref(`Users/${otherUID}`)
        .once('value');

      let lastMessageRef = await database()
        .ref(`conversation/${key}`)
        .child('lm')
        .once('value');

      return {
        data: otherUserData.val(),
        uid: otherUID,
        keyRef: key,
        lm: lastMessageRef.val(),
        label: this.isMyType(currentUserData, otherUserData.val())
          ? 'regular'
          : 'filteredOut',
      };
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };

  assignLabel = (data) => {
    if (!data) return;
    let labelData = {...this.state[data.label]};
    labelData[data.uid] = {};
    labelData[`${data.uid}`]['user_data'] = data.data;
    labelData[`${data.uid}`]['lm'] = data.lm;
    labelData[`${data.uid}`]['keyRef'] = data.keyRef;

    this.setState({[data.label]: labelData});
  };

  isMyType = (user_data, data) => {
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

  fetchCurrentUserData = async () => {
    if (Object.keys(this.state.currentUser).length != 0) {
      return this.state.currentUser;
    }
    try {
      let data = await database().ref(`Users/${this.uid}`).once('value');

      this.setState({currentUser: data.val()});
      return data.val();
    } catch (error) {
      console.log(error);
    }
  };

  checkForChangesInPP = () => {
    this.currentUserRef = database().ref(`Users/${this.uid}`);
    this.currentUserRef.on('child_changed', async (res) => {
      let currentUser = this.fetchCurrentUserData();
      currentUser[res.key] = res.val();
      this.setState({currentUser}, () => {
        if (res.key == 'pp' || res.key == 'bb') {
          this.reEvaluateLabel();
        }
      });
    });
  };

  reEvaluateLabel = () => {
    let all = {...this.state.regular, ...this.state.filteredOut};
    let regular = {};
    let filteredOut = {};
    Object.keys(all).map((key) => {
      if (this.isMyType(this.state.currentUser, all[key].user_data)) {
        regular = {...regular, [key]: all[key]};
      } else {
        filteredOut = {...filteredOut, [key]: all[key]};
      }
    });

    this.setState({regular, filteredOut});
  };

  render() {
    // console.log('chats!: ', this.state.regular, this.state.filteredOut);
    return (
      <ChatRequestContext.Provider
        value={{
          regular: this.state.regular,
          filteredOut: this.state.filteredOut,
        }}>
        {this.props.children}
      </ChatRequestContext.Provider>
    );
  }
}
export default ChatRequestContext;
export {ChatRequestContextProvider};
