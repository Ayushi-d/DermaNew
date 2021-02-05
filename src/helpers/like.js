import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import DateHelpers from './datehelpers';

class Like {}

Like.unlike = async (id) => {
  if (!id) return false;
  if (auth().currentUser) {
    let {uid} = auth().currentUser;

    let userRef = database().ref('Users/' + uid);

    await userRef.child('lt').child(id).set(null);

    await database()
      .ref('Users/' + id)
      .child('lf')
      .child(uid)
      .once('value', (vall) => {
        let value = vall.val() ? vall.val() : 0;
        database()
          .ref('Users/' + id)
          .child('lf')
          .child(uid)
          .set(null);
        database()
          .ref('Users/' + id)
          .child('lf')
          .child('tp')
          .once('value', (snap) => {
            let tp = snap.val() ? snap.val() : 0;
            if (tp < value) {
              database()
                .ref('Users/' + id)
                .child('lf')
                .child('c')
                .once('value', (count) => {
                  let actual_count = count.val() ? count.val() : 0;
                  if (actual_count > 0) {
                    database()
                      .ref('Users/' + id)
                      .child('lf')
                      .child('c')
                      .set(actual_count - 1);
                  }
                });
            }
          });
      });
  }
};

Like.like = async (id) => {
  /**
   * userId will be added to lt of current user
   * userId will be added to lf of liked user
   */
  if (!id) return false;
  if (auth().currentUser) {
    let {uid} = auth().currentUser;
    let userRef = database().ref('Users/' + uid);
    let timestamp = new Date().getTime() / 1000;

    let usr = await userRef.once('value');

    let user = usr.val();

    userRef.child('lt').child(id).set({tp: timestamp});

    let otherUser = database().ref('Users/' + id);

    let oUser = await otherUser.once('value');
    oUser = oUser.val();

    let pref = isMyType(oUser, user);

    otherUser.child('lf').child(uid).set({tp: timestamp, pref: !pref});

    otherUser
      .child('lf')
      .child('c')
      .once('value', (snap) => {
        let count = 1;
        if (snap.val()) {
          count = parseInt(snap.val()) + 1;
        }
        otherUser.child('lf').child('c').set(count);
      });

    /**
     * to do update notification
     */
  }
};
function isMyType(user, data) {
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
}
export default Like;
