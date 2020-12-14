import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class CheckUser {}

CheckUser.isRegistered = async (uid) => {
  if (!uid) return false;

  let snapshot;
  try {
    snapshot = await database()
      .ref('Users/' + uid)
      .once('value');
  } catch (err) {}
  console.log(snapshot.exists());
  return {exists: snapshot.exists(), user: snapshot.val()};
};

CheckUser.isDeleted = async (uid) => {
  if (!uid) return false;

  let snapshot;

  try {
    snapshot = await database()
      .ref('Users/' + uid)
      .once('value');

    let user_data = snapshot.val();
    // console.log(user_data);

    if (user_data && user_data['del'] == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export default CheckUser;
