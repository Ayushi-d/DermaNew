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
    this.userRet = {};
  }

  callUsers = async (lastItem, fromSearch) => {
    if (!lastItem) {
      let snap = await this.users
        .orderByChild('cat')
        .limitToLast(50)
        .once('value');

      let dat = snap.val();

      let new_data = this.getPreferedUsers(dat);

      let lItem = '';

      if (snap.exists && dat) {
        let ks = Object.keys(dat);
        let it = dat[ks[ks.length - 1]];
        lItem = it ? it.cat : '';
      }
      return {new_data, lItem};
    } else {
      let snap = await this.users
        .orderByChild('cat')
        .endAt(lastItem)
        .limitToLast(50)
        .once('value');

      let dat = snap.val();

      let new_data = this.getPreferedUsers(dat);

      let lItem = '';

      if (snap.exists && dat) {
        let ks = Object.keys(dat);
        let it = dat[ks[ks.length - 1]];
        lItem = it ? it.cat : '';
      }
      let finished = Object.keys(dat).length < 50;

      return {new_data, lItem, finished};
    }
  };

  _getUsers = async (lastItem, fromSearch) => {
    let userRet = {};
    let lItem = lastItem;
    let searchLoopCount = 0;
    while (searchLoopCount <= 30) {
      let data = await this.callUsers(lItem);
      let new_data = data.new_data;
      lItem = data.lItem;

      userRet = {...userRet, ...new_data};

      let gUserC = Object.keys(userRet).length;

      if (gUserC >= 10) {
        break;
      } else if (data.finished) {
        break;
      }
      searchLoopCount++;
    }

    return {users: userRet, lItem};
  };

  getUsers = async () => {
    console.log('call');
    if (!this.lastItem) {
      console.log('notlastitem');
      try {
        let snap = await this.users
          .orderByChild('cat')
          .limitToFirst(20)
          .once('value');
        let usrs = snap.val();
        let users = [];
        let ukeys = Object.keys(usrs);

        for (let uk of ukeys) {
          let usr = usrs[uk];
          if (usr.uid !== undefined) {
            users[uk] = usr;
          }
        }

        let new_data = this.getPreferedUsers(users);
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
      console.log('last item: ', this.lastItem, this.pageSize);
      try {
        let snap = await this.users
          .orderByChild('cat')
          .startAt(this.lastItem)
          .limitToFirst(this.pageSize)
          .once('value');

        console.log('chek thi sout!', Object.keys(snap.val()).length);

        let usrs = snap.val();
        let users = [];
        let ukeys = Object.keys(usrs);

        for (let uk of ukeys) {
          let usr = usrs[uk];
          if (usr.uid !== undefined) {
            users[uk] = usr;
          }
        }

        let new_data = this.getPreferedUsers(users);
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
    let dt = Object.keys(returned_data);
    console.log('lat user: ', returned_data[dt[dt.length - 1]].nm);
    this.lastItem = returned_data[dt[dt.length - 1]].cat;
    this.data = {};
    // let d = dt.sort(
    //   (a, b) => returned_data[a].cat * 1000 - returned_data[a].cat * 1000,
    // );
    let all = [];
    dt.forEach((k) => {
      let t = returned_data[k];
      all.push({
        uid: t.uid,
        cat: t.cat,
        date: new Date(t.cat * 1000).toDateString(),
        nm: t.nm,
      });
    });
    console.log(all);
    // console.log()
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
    keys.map((item, idx) => {
      let isMyType = this.isMyType(this.user, data[item]);
      // console.log('after Change: ', isMyType);
      if (isMyType) {
        // console.log('add this!');
        new_data[item] = data[item];
      }
      if (keys.length - 1 === idx) {
        // this.lastItem = data[item].cat;
        // console.log('lastItem: ', data[item].cat, data[item].nm);
      }
    });
    // console.log(Object.keys(new_data).length);
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
