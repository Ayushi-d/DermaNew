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
      loadingT: false,
      loadingF: false,
    };
    this._isMounted = false;
  }

  async componentDidMount() {
    this._isMounted = true;
    if (auth().currentUser) {
      this.uid = auth().currentUser.uid;
      // console.log(this.uid);
      this.currentUserRef = database().ref('Users/' + this.uid);
      this.userBase = database().ref('Users')
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
    let {page} = this.props;

    if (this.ltRef) {
      this.ltRef.off('child_added');
      this.ltRef.off('child_removed');
    }

    if (this.lfRef) {
      this.lfRef.off('child_added');
      this.lfRef.off('child_removed');
    }

    this.setState({loadingT: true, loadingF: true});

    this.ltRef = this.currentUserRef.child('lt');
    let lu_data;
    let lu_filtered_data;
    let lbu_data;

    if (user.lt) {
      this.ltRef.on(
        'child_added',
        async (res) => {
          if (res) {
            this.setState({lt: {...this.state.lt, [res.key]: res.val()}});

            let userData = await this.userBase.child(res.key).once('value');

            let oUser = userData.val();
            // console.log('o value', oUser);

            let lt = {...this.state.lt};
            if (this.state.lbu_data) {
              lbu_data = {...this.state.lbu_data};
            } else {
              lbu_data = {};
            }

            if (oUser === null || oUser.uid === undefined) {
              if (lt[res.key]) {
                delete lt[res.key];
                delete lbu_data[res.key];
                this.setState({lbu_data, lt});
              }
              this.setState({loadingT: false});
              return;
            }

            let uid = user.uid;
            let ouid = oUser.uid;

            let uid1 = uid < ouid ? uid : ouid;
            let uid2 = uid > ouid ? uid : ouid;
            let refKey = uid1 + uid2;
            if (
              (oUser.con &&
                oUser.con[refKey] &&
                oUser.con[refKey].isAcc === -1) ||
              (oUser.bb && oUser.bb[user.uid]) ||
              (oUser.bt && oUser.bt[user.uid])
            ) {
              if (lt[res.key]) {
                delete lt[res.key];
                delete lbu_data[res.key];
                this.setState({lbu_data, lt});
              }
              this.setState({loadingT: false});
              return;
            }

            lbu_data[res.key] = oUser;

            lt[res.key] = res;
            this.setState({lbu_data, lt, loadingT: false});
          } else {
            this.setState({loadingT: false});
          }
        },
        (error) => {
          console.log('userinteraction.js lt_ref error: ', error);
          this.setState({loadingT: false});
        },
      );
    } else {
      this.setState({loadingT: false});
      // console.log('stop loading!');
    }

    this.lfRef = this.currentUserRef.child('lf');

    // this.lfRef.once('value', (res) => {
    //   console.log(res);
    // });

    if (user.lf) {
      this.lfRef.on(
        'child_added',
        async (res) => {
          // console.log('res', res.key);
          if (res && res.key != 'c') {
            let userData = await this.userBase.child(res.key).once('value');
            // console.log(userData);

            let oUser = userData.val();

            let lf = {...this.state.lf};

            lu_data = this.state.lu_data ? {...this.state.lu_data} : {};

            lu_filtered_data = this.state.lu_filtered_data
              ? {...this.state.lu_filtered_data}
              : {};

            // console.log(userData.val(), res.key);

            if (userData.val() === null || userData.val().uid === undefined) {
              if (lf[res.key]) {
                delete lf[res.key];
                delete lu_data[res.key];
                if (lu_filtered_data[res.key]) {
                  delete lu_filtered_data[res.key];
                }
                this.setState({lu_data, lu_filtered_data, lf});
              }
              this.setState({loadingF: false});
              return;
            }

            let uid = user.uid;
            let ouid = oUser.uid;

            let uid1 = uid < ouid ? uid : ouid;
            let uid2 = uid > ouid ? uid : ouid;
            let refKey = uid1 + uid2;
            if (
              (oUser.con &&
                oUser.con[refKey] &&
                oUser.con[refKey].isAcc === -1) ||
              (oUser.bb && oUser.bb[user.uid]) ||
              (oUser.bt && oUser.bt[user.uid])
            ) {
              // console.log('lf', res.key, lf[res.key]);
              if (lf[res.key]) {
                delete lf[res.key];
                delete lu_data[res.key];
                if (lu_filtered_data[res.key]) {
                  delete lu_filtered_data[res.key];
                }
                this.setState({lu_data, lu_filtered_data, lf});
              }
              this.setState({loadingF: false});
              return;
            }

            let isMyType = this.isMyType(
              this.props.mainContext.user,
              userData.val(),
            );

            if (isMyType) {
              lu_data[res.key] = userData.val();
            } else {
              lu_filtered_data[res.key] = userData.val();
            }

            lf[res.key] = res;

            this.setState({lu_data, lu_filtered_data, lf, loadingF: false});
          } else {
            if (user.lf && Object.keys(user.lf).length > 1) {
              // console.log("don't stop leading!");
              return;
            }
            this.setState({loadingF: false});
          }
        },
        (err) => {
          console.log('userinteraction.js lf_ref err: ', err);
          this.setState({loadingF: false});
        },
      );
    } else {
      this.setState({loadingF: false});
    }
  };

  _changeCount = (page) => {
    let {user} = this.props.mainContext;


    let lf = user.lf;
    if(lf == undefined){
      return
    }
    let lfKeys =  Object.keys(lf);
    let rC = 0;
    if (page === 'Regular' || page === 'default') {
      lfKeys.forEach((k) => {
        let l = lf[k];
        if (!l.pref) {
          database()
            .ref(`Users/${user.uid}/lf/${k}`)
            .child('sn')
            .set(1)
            .catch((err) =>
              console.log(
                'userinteractions.js _changeCount regular err: ',
                err,
              ),
            );
          rC += 1;
        }
      });
    } else {
      lfKeys.forEach((k) => {
        let l = lf[k];
        if (l.pref) {
          database()
            .ref(`Users/${user.uid}/lf/${k}`)
            .child('sn')
            .set(1)
            .catch((err) =>
              console.log(
                'userinteractions.js _changeCount filtered err: ',
                err,
              ),
            );
          rC += 1;
        }
      });
    }
  
    let newC = user.lf.c - rC;
    if (newC < 0) {
      newC = 0;
    }

    database()
      .ref(`Users/${user.uid}/lf`)
      .child('c')
      .set(newC)
      .catch((err) =>
        console.log('userinteractions.js _changeCount count err: ', err),
      );
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
    this._isMounted = false;
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
    let {user} = this.props.mainContext;
    const {lu_filtered_data, lu_data} = this.state;
    let sortedFilteredOut = lu_data;
    let sortedRegular = lu_filtered_data;
    if(lu_data !== null){
      sortedFilteredOut = Object.keys(lu_data).sort((a, b) => {
        return user.lf[lu_data[b].uid].tp - user.lf[lu_data[a].uid].tp;
      });
    }
    if(lu_filtered_data !== null){
      sortedRegular = Object.keys(lu_filtered_data).sort((a, b) => {
        return user.lf[lu_filtered_data[b].uid].tp - user.lf[lu_filtered_data[a].uid].tp;
      });
    }
    return (
      <UserInterectionContext.Provider
        value={{
          sent: this.state.lbu_data,
          regular: lu_data,
          filteredOut: lu_filtered_data,
          lt: this.state.lt,
          lf: this.state.lf,
          loadingT: this.state.loadingT,
          loadingF: this.state.loadingF,
          getUserLikeData: this.getUserLikeData,
          childRemoved: this.childRemoved,
          _changeCount: this._changeCount,
        }}>
        {this.props.children}
      </UserInterectionContext.Provider>
    );
  }
}

export default UserInterectionContext;
export {UserInterectionProvider};
