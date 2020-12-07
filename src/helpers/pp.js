import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import DateHelpers from './datehelpers';

class PP {
  constructor(numOfItem, user) {
    this.pageSize = numOfItem;
    this.lastItem = null;
    this.data = {};
    this.users = database().ref('Users');
    this.numOfItem = numOfItem;
    this.user = user;
  }

  getUsers = async () => {
    if (!this.lastItem) {
      try {
        let snap = await this.users
          .orderByChild('cat')
          .limitToFirst(100)
          .once('value');
        let new_data = this.getPreferedUsers(snap.val());
        if (new_data == null) {
          let returned_data = {...this.data};
          this.data = {};
          return returned_data;
        }
        this.data = {...this.data, ...new_data};
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let snap = await this.users
          .orderByChild('cat')
          .startAt(this.lastItem)
          .limitToFirst(this.pageSize)
          .once('value');
        let new_data = this.getPreferedUsers(snap.val());
        if (new_data == null) {
          let returned_data = {...this.data};
          this.data = {};
          return returned_data;
        }
        this.data = {...this.data, ...new_data};
      } catch (error) {
        console.error(error);
      }
    }

    // if (Object.keys(this.data).length <= this.numOfItem) {
    let returned_data = {...this.data};
    this.data = {};
    return returned_data;
    // } else {
    // let data = await this.getUsers();
    // return data;
    // }
  };

  getPreferedUsers = (data) => {
    if (!data) return null;
    let keys = Object.keys(data);
    if (keys.length == 0) {
      return null;
    }
    let new_data = {};
    keys.map((item) => {
      let isMyType = this.isMyType(this.user, data[item]);
      if (isMyType) new_data[item] = data[item];
      this.lastItem = data[item].cat;
    });
    return new_data;
  };

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
}

/**
 * Age
 * Skin Condition
 * Marital Status
 * Religion
 * Country
 * Check if not blocked
 * Check if not declined
 * Check if already talking
 *
 */

export default PP;
