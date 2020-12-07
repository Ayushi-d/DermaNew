import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class Like {}

Like.unlike = async id => {
  if (!id) return false;
  if (auth().currentUser) {
    let {uid} = auth().currentUser;

    let userRef = database().ref('Users/' + uid);

    await userRef
      .child('lt')
      .child(id)
      .set(null);

    await database()
      .ref('Users/' + id)
      .child('lf')
      .child(uid)
      .once('value', vall => {
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
          .once('value', snap => {
            let tp = snap.val() ? snap.val() : 0;
            if (tp < value) {
              database()
                .ref('Users/' + id)
                .child('lf')
                .child('c')
                .once('value', count => {
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

Like.like = async id => {
  /**
   * userId will be added to lt of current user
   * userId will be added to lf of liked user
   */
  if (!id) return false;
  if (auth().currentUser) {
    let {uid} = auth().currentUser;
    let userRef = database().ref('Users/' + uid);
    let timestamp = new Date().getTime() / 1000;

    userRef
      .child('lt')
      .child(id)
      .set(timestamp);

    let otherUser = database().ref('Users/' + id);

    otherUser
      .child('lf')
      .child(uid)
      .set(timestamp);

    otherUser
      .child('lf')
      .child('c')
      .once('value', snap => {
        let count = 1;
        if (snap.val()) {
          count = parseInt(snap.val()) + 1;
        }
        otherUser
          .child('lf')
          .child('c')
          .set(count);
      });

    /**
     * to do update notification
     */
  }
};

export default Like;
