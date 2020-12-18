import React from 'react';
import database from '@react-native-firebase/database';
import DateHelpers from '../helpers/datehelpers';

const FilterOutContext = React.createContext();

class FilterOutContextProvider extends React.Component {
  state = {
    likes: {},
    filteredlikes: {},
    messageReq: {},
  };

  componentDidMount() {
    this.uid = this.props.mainContext.user.uid;
    this.userRef = database().ref('Users/');
    this.getLikesData();
    this.getChatReqData();
  }

  getLikesData = async () => {
    this.likeRef = this.userRef.child(this.uid).child('lf');

    // on child added

    this.likeRef.on('child_added', (snap) => {
      if (snap.key != 'tp' && snap.key != 'c') {
        this.setLikeData(snap.key);
      }
    });

    // on child removed

    this.likeRef.on('child_removed', (snap) => {
      this.removeLikeData(snap.key);
    });
  };

  setLikeData = async (uid) => {
    let data = await this.userRef.child(uid).once('value');

    let isNotMyType = await this.notMyType(
      this.props.mainContext.user,
      data.val(),
    );

    if (!isNotMyType) {
      let filteredlikes = {...this.state.filteredlikes};

      filteredlikes[uid] = data.val();

      this.setState({filteredlikes});
    } else {
      let likes = {...this.state.likes};

      likes[uid] = data.val();

      this.setState({likes});
    }
  };

  removeLikeData = async (uid) => {
    let likes = {...this.state.likes};
    delete likes[uid];
    this.setState({likes});
  };

  getChatReqData = async () => {
    this.chatReqRef = database()
      .ref('Users/' + this.uid)
      .child('rf');

    this.chatReqRef.on('child_added', (snap) => {
      this.chatReqData(snap.key, snap.val());
    });

    this.chatReqRef.on('child_removed', (snap) => {
      let chatRq = {...this.state.messageReq};
      delete chatRq[snap.val()];
      this.setState({messageReq: chatRq});
    });
  };

  chatReqData = async (nid, uid) => {
    let user = await database().ref('Users').child(uid).once('value');

    let isNotMyType = await this.notMyType(
      this.props.mainContext.user,
      user.val(),
    );

    if (!isNotMyType) return;

    let message = await database()
      .ref('Users/' + this.uid)
      .child('rm')
      .child(nid)
      .once('value');

    let chatRq = {...this.state.messageReq};
    chatRq[uid] = {
      message: message.val(),
      user: user.val(),
    };

    this.setState({messageReq: chatRq});
  };

  notMyType = async (user, data) => {
    let preference = user.pp;

    let minAge = preference.a1;
    let maxAge = preference.a2;
    let sc = preference.sc.split(',');
    let rl = preference.rl.split(',');
    let c = preference.c.split(',');
    let ms = preference.ms.split(',');

    userAge = DateHelpers.getAge(data.dob);
    if (
      !(
        parseInt(minAge) <= parseInt(userAge) &&
        parseInt(userAge) <= parseInt(maxAge)
      )
    )
      return true;

    if (user.g == data.g) return true;

    if (!sc.includes(data.sc) && sc != "Doesn't Matter") return true;

    if (!rl.includes(data.rl) && rl != "Doesn't Matter") return true;

    if (!c.includes(data.c) && c != "Doesn't Matter") return true;

    if (!ms.includes(data.ms) && ms != "Doesn't Matter") return true;

    if (user.bt && Object.keys(user.bt).includes(data.uid)) return true;
    if (user.bb && Object.keys(user.bb).includes(data.uid)) return true;

    return false;
  };

  componentWillUnmount() {
    if (this.likeRef) {
      this.likeRef.off('child_added');
      this.likeRef.off('child_removed');
    }

    if (this.chatReqRef) {
      this.chatReqRef.off('child_added');
      this.chatReqRef.off('child_removed');
    }
  }

  render() {
    return (
      <FilterOutContext.Provider
        value={{
          likeData: this.state.likes,
          messageReq: this.state.messageReq,
          user: this.props.mainContext.user,
        }}>
        {this.props.children}
      </FilterOutContext.Provider>
    );
  }
}

export {FilterOutContext, FilterOutContextProvider};
