import React from 'react';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import DateHelpers from '../helpers/datehelpers';

const UserInterectionContext = React.createContext();

/**
 * Regular Like Received
 * Filtered Out Like Received
 * All Like Sent
 */

class UserInterectionProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lu_data: null,
      lbu_data: null,
      lu_filtered_data: null,
      lt: {},
      lf: {},
    };
  }

  async componentDidMount() {
    if (auth().currentUser) {
      this.uid = auth().currentUser.uid;
      // console.log(this.uid);
      this.currentUserRef = database().ref('Users/' + this.uid);
      this.userBase = database().ref('Users');
      this.getUserLikeData();
      this.childRemoved();
    }
  }

  isMyType = (user, data) => {
    let preference = user.pp;

    let minAge = preference.a1;
    let maxAge = preference.a2;
    let sc = preference.sc.split(',');
    let rl = preference.rl.split(',');
    let c = preference.c.split(',');
    let ms = preference.ms.split(',');

    userAge = DateHelpers.getAge(data.dob);

    if (
      parseInt(userAge) < parseInt(minAge) ||
      parseInt(userAge) > parseInt(maxAge)
    ) {
      return false;
    }

    if (user.g == data.g) {
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

    if (user.bt && Object.keys(user.bt).includes(data.uid)) {
      return false;
    }

    if (user.bb && Object.keys(user.bb).includes(data.uid)) {
      return false;
    }

    return true;
  };

  getUserLikeData = async () => {
    let {user} = this.props.mainContext;

    if (this.ltRef) {
      this.ltRef.off('child_added');
      this.ltRef.off('child_removed');
    }

    if (this.lfRef) {
      this.lfRef.off('child_added');
      this.lfRef.off('child_removed');
    }
    this.ltRef = this.currentUserRef.child('lt');
    let lu_data;
    let lu_filtered_data;
    let lbu_data;

    this.ltRef.on(
      'child_added',
      async (res) => {
        if (res) {
          this.setState({lt: {...this.state.lt, [res.key]: res.val()}});

          let userData = await this.userBase.child(res.key).once('value');

          let oUser = userData.val();

          let lt = {...this.state.lt};
          if (this.state.lbu_data) {
            lbu_data = {...this.state.lbu_data};
          } else {
            lbu_data = {};
          }

          let uid = user.uid;
          let ouid = oUser.uid;

          let uid1 = uid < ouid ? uid : ouid;
          let uid2 = uid > ouid ? uid : ouid;
          let refKey = uid1 + uid2;
          if (
            oUser.con &&
            oUser.con[refKey] &&
            oUser.con[refKey].isAcc === -1
          ) {
            if (lt[res.key]) {
              delete lt[res.key];
              delete lbu_data[res.key];
              this.setState({lbu_data, lt});
            }
            return;
          }

          lbu_data[res.key] = oUser;

          lt[res.key] = res;
          this.setState({lbu_data, lt});
        }
      },
      (error) => console.log('getUSerLikeData error: ', error),
    );

    this.lfRef = this.currentUserRef.child('lf');

    // this.lfRef.once('value', (res) => {
    //   console.log(res);
    // });

    this.lfRef.on('child_added', async (res) => {
      if (res && res.key != 'c') {
        let userData = await this.userBase.child(res.key).once('value');
        // console.log(userData);

        let oUser = userData.val();

        if (userData.val() === null) {
          return;
        }
        let isMyType = this.isMyType(
          this.props.mainContext.user,
          userData.val(),
        );

        let lf = {...this.state.lf};

        lu_data = this.state.lu_data ? {...this.state.lu_data} : {};

        lu_filtered_data = this.state.lu_filtered_data
          ? {...this.state.lu_filtered_data}
          : {};

        let uid = user.uid;
        let ouid = oUser.uid;

        let uid1 = uid < ouid ? uid : ouid;
        let uid2 = uid > ouid ? uid : ouid;
        let refKey = uid1 + uid2;
        if (oUser.con && oUser.con[refKey] && oUser.con[refKey].isAcc === -1) {
          console.log('lf', res.key, lf[res.key]);
          if (lf[res.key]) {
            delete lf[res.key];
            delete lu_data[res.key];
            if (lu_filtered_data[res.key]) {
              delete lu_filtered_data[res.key];
            }
            this.setState({lu_data, lu_filtered_data, lf});
          }
          return;
        }

        if (isMyType) {
          lu_data[res.key] = userData.val();
        } else {
          lu_filtered_data[res.key] = userData.val();
        }

        lf[res.key] = res;

        this.setState({lu_data, lu_filtered_data, lf});
      }
    });
  };

  childRemoved = () => {
    this.ltRef = this.currentUserRef.child('lt');

    this.ltRef.on('child_removed', (res) => {
      let lbu_data = {...this.state.lbu_data};
      let lt = {...this.state.lt};

      delete lbu_data[res.key];
      delete lt[res.key];

      this.setState({lbu_data, lt});
    });

    this.lfRef = this.currentUserRef.child('lf');

    this.lfRef.on('child_removed', (res) => {
      let lu_data = {...this.state.lu_data};
      let lu_filtered_data = {...this.state.lu_filtered_data};
      let lf = {...this.state.lf};

      if (lu_data[res.key]) delete lu_data[res.key];
      if (lu_filtered_data[res.key]) delete lu_filtered_data[res.key];

      delete lf[res.key];

      this.setState({lu_data, lu_filtered_data, lf});
    });
  };

  componentWillUnmount() {
    if (this.ltRef) {
      this.ltRef.off('child_added');
      this.ltRef.off('child_removed');
    }

    if (this.lfRef) {
      this.lfRef.off('child_added');
      this.lfRef.off('child_removed');
    }
  }

  render() {
    return (
      <UserInterectionContext.Provider
        value={{
          sent: this.state.lbu_data,
          regular: this.state.lu_data,
          filteredOut: this.state.lu_filtered_data,
          lt: this.state.lt,
          lf: this.state.lf,
          getUserLikeData: this.getUserLikeData,
          childRemoved: this.childRemoved,
        }}>
        {this.props.children}
      </UserInterectionContext.Provider>
    );
  }
}

export default UserInterectionContext;
export {UserInterectionProvider};
